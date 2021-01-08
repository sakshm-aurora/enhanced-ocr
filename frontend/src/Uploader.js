import { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import SpellChecker from "./SpellChecker";
const axios = require("axios");

const Uploader = (props) => {
  const [response, setResponse] = useState(null);
  const myUploader = (event) => {
    var formData = new FormData();
    formData.append("image", event.files[0]);
    axios
      .post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setResponse(res.data.text.trim());
      })
      .catch((e) => {
        console.error(e);
        alert(e.message);
      });
  };
  if (response) {
    return <SpellChecker data={response} setResponse={setResponse} />;
  }
  return (
    <div className="p-text-center">
      <FileUpload
        name="demo"
        url="http://localhost:8080/upload"
        accept="image/*"
        customUpload
        uploadHandler={myUploader}
      ></FileUpload>
    </div>
  );
};

export default Uploader;
