import { NoteRow } from "@/ServerTypes/Demo";
import { Authorization, Decorators, IGetEditValue, ISetEditValue, PropertyItem, TemplatedWidget, Toolbar, confirmDialog, formatDate, formatISODateTimeUTC, insert } from "@serenity-is/corelib";
import * as DOMPurify from 'dompurify';
import { NoteDialog } from "./NoteDialog";

@Decorators.registerEditor('Serenity.Demo.Northwind.NotesEditor', [IGetEditValue, ISetEditValue])
@Decorators.element("<div/>")
export class NotesEditor extends TemplatedWidget<any>
    implements IGetEditValue, ISetEditValue {

    private isDirty: boolean;
    private items: NoteRow[];

    constructor(div: JQuery) {
        super(div);

        new Toolbar({
            element: this.byId('Toolbar'),
            buttons: [{
                title: 'Add Note',
                cssClass: 'add-button',
                onClick: e => {
                    e.preventDefault();
                    this.addClick();
                }
            }]
        });
    }

    protected getTemplate() {
        return "<div><div id='~_Toolbar'></div><ul id='~_NoteList'></ul></div>";
    }

    protected updateContent() {
        var noteList = this.byId('NoteList');
        noteList.children().remove();
        if (this.items) {
            var index = 0;
            for (var t1 = 0; t1 < this.items.length; t1++) {
                var item = this.items[t1];
                var li = $('<li/>');
                $('<div/>').addClass('note-text').html(DOMPurify.sanitize(item.Text ?? '')).appendTo(li);

                $('<a/>').attr('href', '#').addClass('note-date')
                    .text(item.InsertUserDisplayName + ' - ' +
                        formatDate(item.InsertDate, 'g'))
                    .data('index', index).appendTo(li).click((e) => this.editClick(e));

                $('<a/>').attr('href', '#').addClass('note-delete')
                    .attr('title', 'delete note').data('index', index)
                    .appendTo(li).click((e) => this.deleteClick(e));

                li.appendTo(noteList);
                index++;
            }
        }
    }

    protected addClick() {
        var dlg = new NoteDialog();
        dlg.dialogTitle = 'Add Note';
        dlg.okClick = () => {
            var text = dlg.text?.trim();
            if (!text) 
                return;

            this.items = this.items || [];
            insert(this.items, 0, {
                Text: text,
                InsertUserDisplayName: Authorization.userDefinition.DisplayName,
                InsertDate: formatISODateTimeUTC(new Date())
            });

            this.updateContent();
            dlg.dialogClose();
            this.set_isDirty(true);
            this.onChange && this.onChange();
        };
        dlg.dialogOpen();
    }

    protected editClick(e) {
        e.preventDefault();
        var index = $(e.target).data('index');
        var old = this.items[index];
        var dlg = new NoteDialog();
        dlg.dialogTitle = 'Edit Note';
        dlg.text = old.Text;
        dlg.okClick = () => {
            var text = dlg.text?.trim();;
            if (!text)
                return;

            this.items[index].Text = text;
            this.updateContent();
            dlg.dialogClose();
            this.set_isDirty(true);
            this.onChange && this.onChange();
        };
        dlg.dialogOpen();
    }

    public deleteClick(e) {
        e.preventDefault();
        var index = $(e.target).data('index');
        confirmDialog('Delete this note?', () => {
            this.items.splice(index, 1);
            this.updateContent();
            this.set_isDirty(true);
            this.onChange && this.onChange();
        });
    }

    public get value() {
        return this.items;
    }

    public set value(value: NoteRow[]) {
        this.items = value || [];
        this.set_isDirty(false);
        this.updateContent();
    }

    public getEditValue(prop: PropertyItem, target) {
        target[prop.name] = this.value;
    }

    public setEditValue(source, prop: PropertyItem) {
        this.value = source[prop.name] || [];
    }

    public get_isDirty(): boolean {
        return this.isDirty;
    }

    public set_isDirty(value): void {
        this.isDirty = value;
    }

    public onChange: () => void;
}
