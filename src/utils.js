export const setNewOffset = (card, mouseMoveDir = {x:0, y:0}) => {
    const offsetLeft = card.offsetLeft- mouseMoveDir.x;
    const offsetTop = card.offsetTop - mouseMoveDir.y

    return {
        x: offsetLeft <0 ? 0 : offsetLeft,
        y: offsetTop <0 ? 0 : offsetTop
    }
}

export const autoGrow = (textAreaRef) => {
    const { current } = textAreaRef;
    current.style.height = "auto"; // Reset the height
    current.style.height = current.scrollHeight + "px"; // Set the new height
  };

export const setZIndex = (selectedCard) => {
    selectedCard.style.zIndex = 999;
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        if (card !== selectedCard) {
            card.style.zIndex = selectedCard.style.zIndex - 1;
        }
    });
};

export const bodyParser = (value) => {
    try{
        return JSON.parse(value)
    }
    catch(error){
        return value;
    }
}