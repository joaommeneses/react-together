import { pdfjs } from 'pdfjs-dist';

// Set the workerSrc to the path of the worker file for pdf.js (required for async operations)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const loadPdf = async (file) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
        fileReader.onload = async () => {
            try {
                const pdfData = new Uint8Array(fileReader.result);
                const pdf = await pdfjs.getDocument(pdfData).promise;
                const page = await pdf.getPage(1); // Render the first page
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext("2d");

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                resolve(canvas); // Return the canvas containing the PDF page
            } catch (error) {
                reject(error);
            }
        };

        fileReader.onerror = reject;
    });
};
