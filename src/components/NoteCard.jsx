import { useRef, useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";
import { db } from "../../appwrite/databases";
import Spinner from "../icons/Spinner"
import { setNewOffset, autoGrow, setZIndex,bodyParser } from "../utils";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";

export const NoteCard = ({ note}) => {

  const {setSelectedNote} = useContext(NoteContext)


  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);

  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef(null);

  const textAreaRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const KeyUpTimer = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  const mouseDown = (e) => {
    if (e.target.className=="card-header"){
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    setZIndex(cardRef.current)
    setSelectedNote(note)
    }
  };

  const mouseMove = (e) => {
    const mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

    setPosition(newPosition);
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData('position',newPosition);
    db.notes.update(note.$id, {'position' :JSON.stringify(newPosition)})

  };

  const saveData = async (key ,value) =>{
    const payload = {[key]:JSON.stringify(value)};
    try{
      await db.notes.update(note.$id,payload);
    }
    catch(error){
      console.error(error)
    }
    setSaving(false);
  }

  const handleKeyUp = async ()=>{
    setSaving(true)

    if (KeyUpTimer.current){
        clearTimeout(KeyUpTimer.current);
    }
    KeyUpTimer.current = setTimeout(()=>{
      saveData("body", textAreaRef.current.value);
    },2000)
  }

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note.$id} />
        {
        saving && (
          <div className="card-saving">
              <Spinner color={colors.colorText} />
              <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )
      }
      </div>

      <div className="card-body">
        <textarea
        onKeyUp={handleKeyUp}
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          defaultValue={body}
          onInput={() => {
            autoGrow(textAreaRef);
          }}
          onFocus={()=>{
            setZIndex(cardRef.current);
            setSelectedNote(note)
          }}
        ></textarea>
      </div>
    </div>
  );
};
