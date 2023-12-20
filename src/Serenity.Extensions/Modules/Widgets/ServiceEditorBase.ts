import { CascadedWidgetLink, ColumnSelection, Decorators, EditorUtils, ListRequest, ListResponse, RetrieveColumnSelection, RetrieveRequest, RetrieveResponse, Select2AjaxEditor, ServiceOptions, Widget, WidgetProps, serviceCall } from "@serenity-is/corelib";

export interface ServiceEditorOptions {
    cascadeFrom?: string;
    cascadeField?: string;
    cascadeValue?: any;
}

@Decorators.registerClass("Serenity.Extensions.ServiceEditorBase")
export abstract class ServiceEditorBase<P extends ServiceEditorOptions, TRow> extends Select2AjaxEditor<P, TRow> {
    private cascadeLink: CascadedWidgetLink<Widget<any>>;

    constructor(props?: WidgetProps<P>) {
        super(props);

        this.setCascadeFrom(this.options.cascadeFrom);
    }

    private setCascadeFrom(value: string): void {
        if (!value) {
            if (this.cascadeLink) {
                this.cascadeLink.set_parentID(null);
                this.cascadeLink = null;
            }

            this.options.cascadeFrom = null;
            return;
        }

        this.cascadeLink = new CascadedWidgetLink(Widget, this,
            p => this.cascadeValue = this.getCascadeFromValue(p));

        this.cascadeLink.set_parentID(value);
        this.options.cascadeFrom = value;
    }

    public get cascadeValue(): any {
        return this.options.cascadeValue;
    }

    public set cascadeValue(value: any) {
        if (value !== this.options.cascadeValue) {
            this.options.cascadeValue = value;
            this.value = null;
        }
    }

    public get cascadeField(): any {
        return this.options.cascadeField || this.options.cascadeFrom;
    }

    public set cascadeField(value: any) {
        this.options.cascadeField = value;
    }

    public get cascadeFrom(): any {
        return this.options.cascadeFrom;
    }

    public set cascadeFrom(value: any) {
        if (value !== this.options.cascadeFrom) {
            this.setCascadeFrom(value);
        }
    }

    private getCascadeFromValue(parent: Widget<any>) {
        return EditorUtils.getValue(parent);
    }

    protected getIncludeColumns(): string[] {
        return [];
    }

    protected getSort(): string[] {
        return [];
    }

    public getTypeDelay(): number {
        return 200;
    }

    private lastRequest: PromiseLike<ListResponse<TRow>>;

    public executeQueryByKey(options: ServiceOptions<RetrieveResponse<TRow>>): void {
        var request = <RetrieveRequest>options.request;
        request.ColumnSelection = RetrieveColumnSelection.keyOnly;
        request.IncludeColumns = this.getIncludeColumns();
        super.executeQueryByKey(options);
    }

    public executeQuery(options: ServiceOptions<ListResponse<TRow>>): void {

        var request = <ListRequest>options.request;

        request.ColumnSelection = ColumnSelection.KeyOnly;
        request.IncludeColumns = this.getIncludeColumns();
        request.Sort = this.getSort();
        request.ExcludeTotalCount = true;

        if (this.cascadeField) {
            request.EqualityFilter = request.EqualityFilter || {};
            request.EqualityFilter[this.cascadeField] = this.cascadeValue;
        }

        options.blockUI = false;
        options.error = () => { };

        if (this.lastRequest != null && (this.lastRequest as JQueryXHR).readyState != XMLHttpRequest.DONE)
            (this.lastRequest as JQueryXHR)?.abort?.();

        this.lastRequest = serviceCall(options);
        this.lastRequest.then(() => this.lastRequest = null, () => this.lastRequest = null);
    }
}