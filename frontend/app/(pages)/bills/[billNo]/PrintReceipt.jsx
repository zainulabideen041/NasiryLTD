import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";

const PDFReceiptGenerator = ({
  week,
  customerName,
  onSuccess,
  buttonText = "Print Bill",
  className = "hover:cursor-pointer m-2 bg-green-600 text-white text-xl",
}) => {
  // Helper function to get date range from invoices
  const getDateRange = (invoices) => {
    if (invoices.length === 0) return "No invoices";
    const dates = invoices
      .map((inv) => inv.invoiceDate?.split("T")[0])
      .filter((date) => date)
      .sort();
    if (dates.length === 0) return "No dates available";
    if (dates.length === 1) return dates[0];
    return `${dates[0]} to ${dates[dates.length - 1]}`;
  };

  // Function to convert oklch and other modern CSS colors to hex/rgb
  const sanitizeStyles = (element) => {
    // Get all elements including the root element
    const allElements = [element, ...element.querySelectorAll("*")];

    allElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);

      // Convert problematic CSS properties to supported formats
      const propertiesToFix = [
        "color",
        "backgroundColor",
        "borderColor",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "outlineColor",
        "textDecorationColor",
        "caretColor",
      ];

      propertiesToFix.forEach((prop) => {
        const value = computedStyle.getPropertyValue(prop);
        if (
          value &&
          (value.includes("oklch") ||
            value.includes("color(") ||
            value.includes("lch"))
        ) {
          // Convert to RGB using a temporary element
          const tempDiv = document.createElement("div");
          tempDiv.style.color = value;
          document.body.appendChild(tempDiv);
          const rgbValue = window.getComputedStyle(tempDiv).color;
          document.body.removeChild(tempDiv);

          // Apply the converted color
          el.style.setProperty(prop, rgbValue, "important");
        }
      });
    });
  };

  // Alternative: Use jsPDF's built-in text and drawing methods (more reliable)
  const generatePDFWithJsPDFOnly = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setFont(undefined, "bold");
      pdf.text("Nasiry LTD", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");
      pdf.text(
        "Wholesale & Retail of Fresh Quality Halal Meat & Poultry",
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      yPosition += 15;
      pdf.text("07 926 154 379 | UK, London", pageWidth / 2, yPosition, {
        align: "center",
      });

      // Invoice Receipt Title
      yPosition += 20;
      pdf.setFontSize(20);
      pdf.setFont(undefined, "bold");
      pdf.text("INVOICE RECEIPT", pageWidth / 2, yPosition, {
        align: "center",
      });

      // yPosition += 10;
      // pdf.setFontSize(10);
      // pdf.setFont(undefined, "normal");
      // pdf.text(
      //   `Generated on ${new Date().toLocaleDateString()}`,
      //   pageWidth / 2,
      //   yPosition,
      //   { align: "center" }
      // );

      // Customer Details
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Customer Details:", 20, yPosition);
      pdf.text("Invoice Summary:", pageWidth - 20, yPosition, {
        align: "right",
      });

      yPosition += 8;
      pdf.setFont(undefined, "normal");
      pdf.text(`Name: ${customerName}`, 20, yPosition);
      pdf.text(
        `Total Invoices: ${week.invoices.length}`,
        pageWidth - 20,
        yPosition,
        { align: "right" }
      );

      yPosition += 8;
      pdf.text(`Week: Week ${week.weekNo}`, 20, yPosition);
      pdf.text(
        `Date Range: ${getDateRange(week.invoices)}`,
        pageWidth - 20,
        yPosition,
        { align: "right" }
      );

      // Table Header
      yPosition += 20;
      pdf.setFont(undefined, "bold");
      pdf.text("Invoice No.", 20, yPosition);
      pdf.text("Date", pageWidth / 2, yPosition, { align: "center" });
      pdf.text("Amount", pageWidth - 20, yPosition, { align: "right" });

      // Table separator line
      yPosition += 3;
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);

      // Table rows
      yPosition += 8;
      pdf.setFont(undefined, "normal");
      week.invoices.forEach((invoice) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(invoice.invoiceNo.toString(), 20, yPosition);
        pdf.text(
          invoice.invoiceDate?.split("T")[0] ?? "N/A",
          pageWidth / 2,
          yPosition,
          { align: "center" }
        );
        pdf.text(`£${invoice.invoiceAmount}`, pageWidth - 20, yPosition, {
          align: "right",
        });
        yPosition += 8;
      });

      // Summary section
      yPosition += 10;
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);

      yPosition += 10;
      pdf.setFont(undefined, "bold");
      pdf.text("Amount Received:", 20, yPosition);
      pdf.text(`£${week.receivedAmount}`, pageWidth - 20, yPosition, {
        align: "right",
      });

      yPosition += 8;
      pdf.text("Remaining Amount:", 20, yPosition);
      pdf.setTextColor(220, 38, 38); // Red color for remaining amount
      pdf.text(`£${week.remainingAmount}`, pageWidth - 20, yPosition, {
        align: "right",
      });

      yPosition += 8;
      pdf.setTextColor(0, 0, 0); // Reset to black
      pdf.text("Total Amount:", 20, yPosition);
      pdf.text(`£${week.totalAmount}`, pageWidth - 20, yPosition, {
        align: "right",
      });

      // Footer
      yPosition += 20;
      pdf.setFont(undefined, "normal");
      pdf.setFontSize(10);
      pdf.text("Thank you for your business!", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 5;
      pdf.text(
        "For any queries, please contact us at 07 926 154 379",
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      // Download the PDF
      const fileName = `Invoice_Receipt_${customerName}_Week${week.weekNo}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF receipt. Please try again.");
      return false;
    }
  };

  // Main PDF generation function with fixed html2canvas approach
  const generatePDFReceipt = async () => {
    try {
      // Create a temporary container for the receipt
      const receiptContainer = document.createElement("div");
      receiptContainer.style.position = "absolute";
      receiptContainer.style.left = "-9999px";
      receiptContainer.style.top = "0";
      receiptContainer.style.width = "800px";
      receiptContainer.style.background = "white";
      receiptContainer.style.padding = "20px";
      receiptContainer.style.fontFamily = "Arial, sans-serif";

      // Create the receipt HTML content with only safe CSS colors
      receiptContainer.innerHTML = `
        <div style="width: 100%; background: white; padding: 20px; box-sizing: border-box;">
          <!-- Navbar Section -->
          <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: center; align-items: center; text-align: center; margin-bottom: 15px;">
              <div style="flex: 1;">
                <div style="position: relative; margin-bottom: 10px;">
                  <h1 style="font-size: 36px; font-weight: bold; margin: 0; color: #1f2937;">Nasiry</h1>
                  <span style="position: absolute; top: 0; right: -30px; font-size: 10px; background: #000000; color: #ffffff; padding: 2px 6px; border-radius: 3px;">LTD</span>
                </div>
                <p style="font-size: 18px; font-weight: 300; margin: 0; color: #6b7280;">
                  Wholesale & Retail of Fresh Quality Halal Meat & Poultry
                </p>
              </div>
            </div>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; padding: 15px; background: #f9fafb; border-radius: 8px;">
              <p style="display: flex; align-items: center; margin: 5px 15px; color: #059669; font-weight: 600;">
                07 926 154 379
              </p>
              <p style="display: flex; align-items: center; margin: 5px 15px; color: #059669; font-weight: 600;">
                07 710 437 795
              </p>
              <p style="display: flex; align-items: center; margin: 5px 15px; color: #059669; font-weight: 600;">
                UK, London
              </p>
            </div>
          </div>
          <!-- Receipt Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 28px; font-weight: bold; margin: 0; color: #1f2937;">INVOICE RECEIPT</h2>
          </div>
          <!-- Customer Information -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div>
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #1f2937;">Customer Details:</h3>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Name:</strong> ${customerName}</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Week:</strong> Week ${
                week.weekNo
              }</p>
            </div>
            <div style="text-align: right;">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #1f2937;">Invoice Summary:</h3>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Total Invoices:</strong> ${
                week.invoices.length
              }</p>
              <p style="margin: 5px 0; color: #4b5563;"><strong>Date Range:</strong> ${getDateRange(
                week.invoices
              )}</p>
            </div>
          </div>
          <!-- Invoice Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e5e7eb;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #1f2937;">Invoice No.</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #1f2937;">Date</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #1f2937;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${week.invoices
                .map(
                  (invoice) => `
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px; color: #4b5563;">${
                    invoice.invoiceNo
                  }</td>
                  <td style="padding: 10px; text-align: center; color: #4b5563;">${
                    invoice.invoiceDate?.split("T")[0] ?? "N/A"
                  }</td>
                  <td style="padding: 10px; text-align: right; color: #4b5563;">£${
                    invoice.invoiceAmount
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <!-- Summary Section -->
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: 600; color: #1f2937;">Amount Received:</span>
              <span style="font-weight: 600; color: #059669;">£${
                week.receivedAmount
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: 600; color: #1f2937;">Remaining Amount:</span>
              <span style="font-weight: 600; color: #dc2626;">£${
                week.remainingAmount
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #e5e7eb;">
              <span style="font-size: 18px; font-weight: bold; color: #1f2937;">Total Amount:</span>
              <span style="font-size: 18px; font-weight: bold; color: #1f2937;">£${
                week.totalAmount
              }</span>
            </div>
          </div>
          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">Thank you for your business!</p>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;">For any queries, please contact us at 07 926 154 379</p>
          </div>
        </div>
      `;

      // Append to document body temporarily
      document.body.appendChild(receiptContainer);

      // Sanitize styles to remove unsupported color functions
      sanitizeStyles(receiptContainer);

      // Convert to canvas with additional options to handle color issues
      const canvas = await html2canvas(receiptContainer, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Skip elements that might have problematic styles
          const style = window.getComputedStyle(element);
          const colorProps = ["color", "backgroundColor", "borderColor"];
          return colorProps.some((prop) => {
            const value = style.getPropertyValue(prop);
            return (
              value &&
              (value.includes("oklch") ||
                value.includes("color(") ||
                value.includes("lch"))
            );
          });
        },
      });

      // Remove the temporary container
      document.body.removeChild(receiptContainer);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `Invoice_Receipt_${customerName}_Week${week.weekNo}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (error) {
      console.error("Error generating PDF with html2canvas:", error);
      console.log("Falling back to jsPDF-only approach...");
      return generatePDFWithJsPDFOnly();
    }
  };

  // Handle PDF generation
  const handlePrintBill = async () => {
    await generatePDFReceipt();
  };

  return (
    <Button onClick={handlePrintBill} className={className}>
      {buttonText}
    </Button>
  );
};

export default PDFReceiptGenerator;
