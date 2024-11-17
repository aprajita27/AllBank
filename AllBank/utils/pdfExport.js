import { jsPDF } from "jspdf";

export const generatePDF = async (transactions) => {
	try {
		const doc = new jsPDF();

		// Add title
		doc.setFontSize(18);
		doc.text("Transaction Statement", 10, 10);

		// Add table headers
		doc.setFontSize(12);
		doc.text("Type", 10, 20);
		doc.text("Amount", 50, 20);
		doc.text("Description", 90, 20);
		doc.text("Date", 150, 20);

		// Add transaction data
		transactions.forEach((txn, index) => {
			const y = 30 + index * 10; // Row spacing
			doc.text(txn.type.toUpperCase(), 10, y);
			doc.text(`$${txn.amount.toFixed(2)}`, 50, y);
			doc.text(txn.description, 90, y);
			doc.text(
				new Date(txn.timestamp.toMillis()).toLocaleString(),
				150,
				y
			);
		});

		// Save the PDF
		const pdfOutput = doc.output("blob");
		const pdfUrl = URL.createObjectURL(pdfOutput);

		// Open the PDF in a new browser tab or prompt download
		window.open(pdfUrl);

		return pdfUrl;
	} catch (error) {
		console.error("Error generating PDF:", error);
		throw error;
	}
};
