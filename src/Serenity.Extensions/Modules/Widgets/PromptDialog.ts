import { Decorators, DialogTexts, PropertyDialog, WidgetProps, toggleClass } from "@serenity-is/corelib";

export interface PromptDialogOptions {
    cssClass?: string;
    editorType?: string;
    editorOptions?: any;
    title?: string;
    message?: string;
    isHtml?: boolean;
    value?: any;
    required?: boolean;
    validateValue: (v: any) => boolean;
}

@Decorators.registerClass("Serenity.Extensions.PromptDialog")
export class PromptDialog<P extends PromptDialogOptions = PromptDialogOptions> extends PropertyDialog<any, P> {

    constructor(props: WidgetProps<P>) {
        super(props);

        if (this.options.cssClass)
            toggleClass(this.domNode, this.options.cssClass);

        if (this.options.message) {
            var msg = document.createElement("div");
            msg.classList.add("message");
            this.byId("PropertyGrid").prepend(msg);
            if (this.options.isHtml)
                msg.innerHTML = this.options.message;
            else
                msg.textContent = this.options.message;
        }

        this.dialogTitle = this.options.title || "Prompt";

    }

    protected getDialogButtons() {
        return [
            {
                text: DialogTexts.OkButton,
                click: () => {
                    if (!this.validateForm())
                        return;

                    if (this.options.validateValue == null || this.options.validateValue(this.value))
                        this.dialogClose();
                },
            },
            {
                text: DialogTexts.CancelButton,
                click: () => this.dialogClose()
            }
        ];
    }

    protected loadInitialEntity() {
        this.value = this.options.value;
    }

    protected getPropertyItems() {
        return [
            {
                name: "Value",
                editorType: this.options.editorType || "String",
                required: this.options.required ?? true,
                editorParams: this.options.editorOptions
            }
        ]
    }

    public get value() {
        return (this.getSaveEntity() as any).Value;
    }

    public set value(v: any) {
        this.propertyGrid.load(
            {
                Value: v
            });
    }

    public static prompt(title: string, message: string, value: string, validateValue: (string) => boolean) {
        new PromptDialog({
            title: title,
            message: message,
            value: value,
            validateValue: v => validateValue(v)
        }).dialogOpen();
    }
}