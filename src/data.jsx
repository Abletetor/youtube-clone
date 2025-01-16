// Exporting API key
export const API_KEY = import.meta.env.VITE_APP_API;

// Views value converter
export const viewsValueConverter = (value) => {
   if (value >= 1000000) {
      return `${Math.floor((value / 1000000))}M`;
   } else if (value >= 1000) {
      return `${Math.floor((value / 1000))}K`;
   } else {
      return value;
   }
};

// Format description
export const formatDescription = (description) => {
   // Split by newlines
   const paragraphs = description.split("\n");

   // Render each paragraph
   return paragraphs.map((paragraph, index) => (
      <p key={ index }>
         { paragraph.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
            if (part.match(/^https?:\/\//)) {
               // If part is a URL, render it as a link
               return (
                  <a
                     key={ i }
                     href={ part }
                     target="_blank"
                     rel="noopener noreferrer"
                     style={ { color: "#0066cc", textDecoration: "underline" } }
                  >
                     { part }
                  </a>
               );
            }
            // Otherwise, render as plain text
            return part;
         }) }
      </p>
   ));
};

