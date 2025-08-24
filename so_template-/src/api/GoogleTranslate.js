// // GoogleTranslate.js
// import React, { useEffect } from "react";

// const GoogleTranslate = () => {
//   useEffect(() => {
//     // Create script tag for Google Translate
//     const addScript = document.createElement("script");
//     addScript.src =
//       "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     addScript.async = true;
//     document.body.appendChild(addScript);

//     // Initialize function
//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "en", // Change this to your default language
//           includedLanguages: "en,so", // Add the languages you want
//           layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
//         },
//         "google_translate_element"
//       );
//     };
//   }, []);

//   return (
//     <div id="google_translate_element" style={{ textAlign: "right", margin: "10px" }}></div>
//   );
// };

// export default GoogleTranslate;


// src/api/GoogleTranslate.js
import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Load Google Translate script if not already loaded
    if (!document.querySelector("#google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);
    }

    // Define global init function for Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", // default language of site
          includedLanguages: "en,so", // available languages
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        },
        "google_translate_element"
      );
    };

    // Define global changeLanguage function for custom dropdown
    window.changeLanguage = (lang) => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
      }
    };
  }, []);

  // Keep this hidden in the DOM (Google needs it)
  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    ></div>
  );
};

export default GoogleTranslate;

