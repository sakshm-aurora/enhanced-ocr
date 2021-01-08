import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { useRef, Fragment } from "react";
const IncorrectTerm = ({ text, suggestions, setCorrectText, index }) => {
  const refContainer = useRef(null);
  return (
    <Fragment>
      <span
        onClick={(e) => refContainer.current.toggle(e)}
        className="p-mx-1 text-danger clickable"
      >
        {text}
      </span>

      <OverlayPanel ref={refContainer} showCloseIcon dismissable>
        {suggestions.map((s) => (
          <Button
            onClick={() => {
              console.log(s.correction, index);
              setCorrectText(s.correction, index);
            }}
            className="p-button-sm p-mr-1"
            label={s.correction}
          ></Button>
        ))}
      </OverlayPanel>
    </Fragment>
  );
};

export default IncorrectTerm;
