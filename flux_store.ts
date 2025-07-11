import { FluxAction } from "./flux_action";
import { fluxDispatcher } from "./flux_dispatcher";

/**
 * 監聽store的回調
 */
type StoreHandler = (action: FluxAction) => void;

/**
 * flux store
 * @summary 存放業務資料和業務邏輯, 並且只提供getter讓人取得資料
 * @summary 向dispatcher註冊callback
 * @summary 當callback收到action後, 根據action.type更新store
 * @summary 當store更新會觸發listener, 通知view進行更新
 */
export abstract class FluxStore {
    /**
     * 完整的flux store列表
     */
    private static _stores: FluxStore[] = [];

    /**
     * 監聽變化的view
     */
    private declare _listeners: Map<StoreHandler, { target: Object, once: boolean }>;

    /**
     * 關閉flux store系統
     */
    public static shutdown(): void {
        this._stores.forEach(item => item.close());
        this._stores.length = 0;
    }

    /**
     * 
     */
    constructor() {
        FluxStore._stores.push(this);

        this._listeners = new Map();
        fluxDispatcher.register(action => this.subscribe(action));
    }

    /**
     * 關閉flux store
     */
    public close(): void {
        this._listeners.clear();
    }

    /**
     * 訂閱關注的action
     */
    protected abstract subscribe(action: FluxAction): void;

    /**
     * 監聽store變化
     * @param handler 處理回調
     * @param target 觸發對象
     * @param once 是否只觸發單次
     */
    public on(handler: StoreHandler, target: Object, once: boolean = false): void {
        if (!handler || this._listeners.has(handler)) {
            return;
        }

        this._listeners.set(handler, { target, once });
    }

    /**
     * 取消監聽store
     * @param handler 處理回調
     */
    public off(handler: StoreHandler): void {
        if (!this._listeners.has(handler)) {
            return;
        }

        this._listeners.delete(handler);
    }

    /**
     * 清除該對象所有的store監聽
     */
    public offBy(target: Object): void {
        if (!target) {
            return;
        }

        let jobs: any[] = [];

        this._listeners.forEach((data, handler) => {
            if (data.target == target) {
                jobs.push(handler);
            }
        });

        jobs.forEach(item => this.off(item), this);
    }

    /**
     * 給監聽store的對象派發事件
     * @summary 可等待view完成後再繼續後續行為
     */
    protected async emit(action: FluxAction): Promise<void> {
        let jobs: any[] = [];
        let once: any[] = [];

        this._listeners.forEach((data, handler) => {
            jobs.push(handler.apply(data.target, action));

            if (data.once) {
                once.push(handler);
            }
        });

        once.forEach(item => this.off(item), this);

        await Promise.all(jobs);
    }
}
