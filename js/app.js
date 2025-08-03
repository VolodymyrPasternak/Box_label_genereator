window.jsPDF = window.jspdf.jsPDF

    function toPt(mm) {
        let result = mm * 2.83465
        return result
    }

    async function generateInnerLablePDF() {
        const { jsPDF } = window.jspdf;

        // const mxp = 1287632
        // const projectName = "Alma Cruises\nAlma Cruises"
        // const productCode = "H-ALMACRU-0224"
        // const vesselName = "Some"
        // const assaPoSo = "PO 4500044551 / SO 5000066945"
        // const tlsOrder = "NL013031"
        const mxp = document.getElementById("mxp").value.toUpperCase()
        const projectName = document.getElementById("projectName").value
        const productCode = document.getElementById("productCode").value.toUpperCase()
        const vesselName = document.getElementById("vesselName").value
        const assaPoSo = document.getElementById("assaPoSo").value.toUpperCase()
        const tlsOrder = document.getElementById("tlsOrder").value.toUpperCase()
        const inBoxQuantity = 200

        const logo = document.getElementById("logo")
        const image = new Image()
        image.src = "img/assa_logo.png"
    
      // Створюємо PDF: розміри 8 см x 5 см (1 см ≈ 28.346 pt)
        const doc = new jsPDF({
            unit: "pt",
            format: [toPt(80), toPt(50)], // 8x5 см
            orientation: "landscape",
        });

        const pageWidth = doc.internal.pageSize.getWidth()
        const maxTextWidth = pageWidth - toPt(6)

        doc.setFont("Arial", "normal")   
        doc.setFontSize(13)
        doc.text(`MXP# ${mxp}`, toPt(2), toPt(16))
        const wrappedText = doc.splitTextToSize(projectName, maxTextWidth)
        doc.setFont("Arial", "bold")
        doc.text(wrappedText, pageWidth / 2, toPt(21), {align: "center"})
        doc.setFont("Arial", "normal")
        doc.text(productCode, pageWidth / 2, toPt(32), {align: "center"})
        if (vesselName) {
            doc.text(`Vessel name: `, toPt(2), toPt(37))
        }
        doc.text(assaPoSo, toPt(2), toPt(42))
        doc.setFont("Arial", "bold")
        doc.text(tlsOrder, toPt(2), toPt(47))
        doc.text(`${inBoxQuantity} pcs.`, toPt(59), toPt(47))

        doc.addImage(image, "png", toPt(10), toPt(3), toPt(60), toPt(8))

        doc.save(`${tlsOrder}_${mxp}_Inner carton label.pdf`);
    }

    async function generateOuterLablePDF() {
        const { jsPDF } = window.jspdf;

        const mxp = document.getElementById("mxp").value.toUpperCase()
        const projectName = document.getElementById("projectName").value
        const productCode = document.getElementById("productCode").value.toUpperCase()
        const vesselName = document.getElementById("vesselName").value
        const assaPoSo = document.getElementById("assaPoSo").value.toUpperCase()
        const tlsOrder = document.getElementById("tlsOrder").value.toUpperCase()

        const inBoxQuantity = parseInt(document.getElementById("inBoxQuantity").value)
        const quantityInOrder = parseInt(document.getElementById("quantityInOrder").value)
        
        const fullBoxQuantity = Math.floor(quantityInOrder / inBoxQuantity)
        const remainedQuantity = quantityInOrder - (fullBoxQuantity * inBoxQuantity)
        const totalBoxes = remainedQuantity === 0 ? fullBoxQuantity : fullBoxQuantity + 1;

        const logo = document.getElementById("logo")
        const image = new Image()
        image.src = "img/assa_logo.png"
    
      // Створюємо PDF: розміри 10 см x 7.5 см (1 см ≈ 28.346 pt)
        const doc = new jsPDF({
            unit: "pt",
            format: [toPt(100), toPt(75)], // 10x7.5 см
            orientation: "landscape",
        });

        const pageWidth = doc.internal.pageSize.getWidth()
        const maxTextWidth = pageWidth - toPt(6)

        for (let i = 0; i < totalBoxes; i++) {
            const isLastPage = (i === totalBoxes - 1);
            const currentBoxQuantity = isLastPage && remainedQuantity !== 0 ? remainedQuantity : inBoxQuantity

            doc.setFont("Arial", "normal")   
            doc.setFontSize(17)
            doc.text(`MXP# ${mxp}`, toPt(3), toPt(22))
            const wrappedText = doc.splitTextToSize(projectName, maxTextWidth)
            doc.setFont("Arial", "bold")
            doc.setFontSize(18)
            doc.text(wrappedText, pageWidth / 2, toPt(29), {align: "center"})
            doc.setFont("Arial", "normal")
            doc.setFontSize(17)
            doc.text(productCode, pageWidth / 2, toPt(44), {align: "center"})
            if (vesselName) {
                doc.text(`Vessel name: `, toPt(3), toPt(50))
            }
            doc.text(assaPoSo, toPt(3), toPt(57))
            doc.text(tlsOrder, toPt(3), toPt(64))
            doc.setFont("Arial", "bold")
            doc.setFontSize(18)
            doc.text(`Q-ty: ${currentBoxQuantity}`, toPt(3), toPt(71))

            doc.text(`${i+1}/${totalBoxes}`, toPt(85), toPt(71))
            doc.addImage(image, "png", toPt(3), toPt(3), toPt(94), toPt(12))
            
            if (i < totalBoxes - 1) {
                doc.addPage(); // Додає нову сторінку, крім останньої
            }
        }
        doc.save(`${tlsOrder}_${mxp}_Outer carton label.pdf`);
    }
