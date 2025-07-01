/**
 * flux action
 * @summary 規範所有改變資料的動作, 如登入、請求資料、新增代辦事項...等等
 */
export interface FluxAction {
    /**
     * 種類
     */
    type: string;

    /**
     * 數據
     * @summary 只有實作者知道內容
     */
    data?: any;
}
