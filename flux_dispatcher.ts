import { FluxAction } from "./flux_action";

/**
 * flux dispatcher
 * @summary 提供api讓store註冊callback
 * @summary 當收到action時, 會依序將action傳給callback
 */
export class FluxDispatcher {
    /**
     * store註冊的callback
     */
    private declare _callbacks: ((action: FluxAction) => void)[];

    /**
     * 
     */
    constructor() {
        this._callbacks = [];
    }

    /**
     * 關閉flux dispatcher
     */
    public close(): void {
        this._callbacks.length = 0;
    }

    /**
     * 註冊回調
     */
    public register(callback: (action: FluxAction) => void): void {
        this._callbacks.push(callback);
    }

    /**
     * 廣播action給所有callback
     */
    public broadcast(action: FluxAction): void {
        this._callbacks.forEach(item => item(action));
    }
}

/**
 * flux dispatcher impl
 */
export const fluxDispatcher = new FluxDispatcher();
