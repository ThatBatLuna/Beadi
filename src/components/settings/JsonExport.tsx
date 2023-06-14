import { FunctionComponent, useCallback, useRef } from "react";
import { useDisplayStore } from "../../engine/store";
import { Button } from "../input/Button";

export type ImportFromJsonProps = {
    
}
export const ImportFromJson: FunctionComponent<ImportFromJsonProps> = () => {
  const overwriteStoreData = useDisplayStore((store) => store.overwrite);
  const pickerRef = useRef<HTMLInputElement>(null);
    
    const onFileChanged: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        console.log("On File Changed: ", e.target.files);
        if(e.target.files?.length == 1){
            const file = e.target.files.item(0)
            file?.text().then(text => JSON.parse(text)).then(result => {
                overwriteStoreData(result.nodes, result.edges, result.handles);
                if(pickerRef.current){
                    pickerRef.current.value = "";
                }
            })
        }
    }, [overwriteStoreData]);

    return <>
        <Button Element={"label" as any}>
            <div>Import from File</div> 
            <input ref={pickerRef} type="file" onChange={onFileChanged} className="hidden"></input>
        </Button>
    </>
}