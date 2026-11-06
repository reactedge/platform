import type { WidgetConfig } from "../bootstrap/config/Config";
import {Toolbar} from "./WidgetWordeditor/Toolbar.tsx";
import {Document} from "./WidgetWordeditor/Document.tsx";
import {SaveOrExport} from "./WidgetWordeditor/SaveOrExport.tsx";
import {DocumentStateProvider} from "../state/Document/DocumentStateProvider.tsx";
import {EditorToolbar} from "./WidgetWordeditor/EditorToolbar.tsx";
import {BlockPalette} from "./WidgetWordeditor/Document/Block/BlockPalette.tsx"
import {Header} from "./Header.tsx";

type Props = {
    config: WidgetConfig
};

export const WidgetWordeditor = ({
     config
 }: Props) => {
    return (
        <DocumentStateProvider>
            <Header config={config} />
            <Toolbar/>
            <EditorToolbar/>
            <div className="word-editor__workspace">
                <BlockPalette/>

                <div className="word-editor__document-area">
                    <Document/>
                </div>
            </div>
            <SaveOrExport/>
        </DocumentStateProvider>
    );
};