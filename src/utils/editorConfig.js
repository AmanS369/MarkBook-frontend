export const configureEditor = (deleteFile) => ({
  height: 500,
  menubar: false,
  plugins: [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
    "codesample markdown",
  ],
  toolbar:
    "undo redo | formatselect | " +
    "bold italic backcolor | alignleft aligncenter " +
    "alignright alignjustify | bullist numlist outdent indent | " +
    "removeformat | help | codesample | image | markdown",
  content_style:
    "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; line-height: 1.6; }",
  codesample_languages: [
    { text: "HTML/XML", value: "markup" },
    { text: "JavaScript", value: "javascript" },
    { text: "CSS", value: "css" },
    { text: "PHP", value: "php" },
    { text: "Ruby", value: "ruby" },
    { text: "Python", value: "python" },
    { text: "Java", value: "java" },
    { text: "C", value: "c" },
    { text: "C#", value: "csharp" },
    { text: "C++", value: "cpp" },
  ],
  setup: (editor) => {
    editor.on("NodeChange", (e) => {
      const node = e.element;
      if (node.getAttribute("data-file-id")) {
        const fileId = node.getAttribute("data-file-id");
        const deleteButton = editor.dom.create(
          "button",
          {
            class: "delete-file-button",
            style:
              "position: absolute; top: 0; right: 0; background: red; color: white; border: none; padding: 2px 5px; cursor: pointer;",
          },
          "X",
        );
        editor.dom.insertAfter(deleteButton, node);
        editor.dom.bind(deleteButton, "click", (e) => {
          e.preventDefault();
          deleteFile(fileId);
          editor.dom.remove(node);
          editor.dom.remove(deleteButton);
        });
      }
    });

    // Add support for Markdown-like shortcuts
    editor.on("keydown", (e) => {
      if (e.key === "Enter") {
        const node = editor.selection.getNode();
        const text = node.textContent;

        if (text.startsWith("# ")) {
          e.preventDefault();
          editor.execCommand(
            "mceInsertContent",
            false,
            "<h1>" + text.substring(2) + "</h1>",
          );
          return;
        }

        if (text.startsWith("## ")) {
          e.preventDefault();
          editor.execCommand(
            "mceInsertContent",
            false,
            "<h2>" + text.substring(3) + "</h2>",
          );
          return;
        }

        if (text.startsWith("* ") || text.startsWith("- ")) {
          e.preventDefault();
          editor.execCommand("InsertUnorderedList");
          editor.execCommand("mceInsertContent", false, text.substring(2));
          return;
        }

        if (text.startsWith("1. ")) {
          e.preventDefault();
          editor.execCommand("InsertOrderedList");
          editor.execCommand("mceInsertContent", false, text.substring(3));
          return;
        }
      }
    });
  },
  formats: {
    alignleft: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
      classes: "text-left",
    },
    aligncenter: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
      classes: "text-center",
    },
    alignright: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
      classes: "text-right",
    },
    alignjustify: {
      selector: "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li",
      classes: "text-justify",
    },
  },
  style_formats: [
    { title: "Heading 1", format: "h1" },
    { title: "Heading 2", format: "h2" },
    { title: "Heading 3", format: "h3" },
    { title: "Paragraph", format: "p" },
    { title: "Blockquote", format: "blockquote" },
    { title: "Code", inline: "code" },
  ],
});
