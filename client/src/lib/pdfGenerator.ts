import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Company Data Constant
const COMPANY_DATA = {
    name: "AGM INVEST",
    address: "MELPARK – 40 rue Jean Monnet",
    zipCity: "68200 Mulhouse – France",
    siret: "389 858 630 00046",
    orias: "14001635",
    capital: "7 622 €",
    email: "contact@agm-negoce.com",
    phone: "AGM INVEST +33 7 56 84 41 45"
};

// --- Helper: Header & Footer ---
const addHeaderFooter = (doc: jsPDF, title: string, docRef: string) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Header
        doc.setFillColor(0, 61, 130); // ELY BLUE
        doc.rect(0, 0, width, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(COMPANY_DATA.name, 14, 25);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("L'excellence en financement", 14, 32);

        doc.setFontSize(14);
        doc.text(title.toUpperCase(), width - 15, 25, { align: "right" });
        doc.setFontSize(9);
        doc.text(`Réf: ${docRef}`, width - 15, 32, { align: "right" });

        // Footer
        doc.setFillColor(245, 247, 250);
        doc.rect(0, height - 25, width, 25, 'F');

        doc.setTextColor(100, 116, 139); // Slate 500
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(COMPANY_DATA.name, width / 2, height - 18, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text(
            `${COMPANY_DATA.address}, ${COMPANY_DATA.zipCity} | SIRET: ${COMPANY_DATA.siret} | ORIAS: ${COMPANY_DATA.orias}`,
            width / 2,
            height - 12,
            { align: "center" }
        );
        doc.text(`Page ${i} sur ${pageCount}`, width - 15, height - 10, { align: "right" });
    }
};

// --- Generator: Loan Contract ---
export const generateLoanContract = (client: any, loan: any) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('fr-FR');
    const contractRef = `PRT-${loan.id.substring(0, 8).toUpperCase()}`;

    // -- Content --
    let y = 55;
    const leftX = 14;
    const rightX = 110;

    // Title Section
    doc.setFontSize(12);
    doc.setTextColor(0, 61, 130);
    doc.text("CONTRAT DE PRÊT PERSONNEL", leftX, y);

    // Parties
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(leftX, y, 196, y);
    y += 10;

    // Lender
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("ENTRE LE PRÊTEUR :", leftX, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(COMPANY_DATA.name, leftX, y);
    doc.text(COMPANY_DATA.address, leftX, y + 5);
    doc.text(COMPANY_DATA.zipCity, leftX, y + 10);

    // Borrower
    doc.setFont("helvetica", "bold");
    doc.text("ET L'EMPRUNTEUR :", rightX, y - 6);
    doc.setFont("helvetica", "normal");
    doc.text(`${client.firstName} ${client.lastName}`.toUpperCase(), rightX, y);
    doc.text(client.address || "Adresse non renseignée", rightX, y + 5);
    doc.text(`${client.zipCode || ""} ${client.city || ""}`, rightX, y + 10);

    y += 25;

    // Loan Details Table
    doc.setFont("helvetica", "bold");
    doc.text("CARACTÉRISTIQUES DU PRÊT", leftX, y);
    y += 5;

    autoTable(doc, {
        startY: y,
        head: [['Désignation', 'Valeur']],
        body: [
            ['Montant du capital emprunté', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loan.totalAmount)}`],
            ['Durée du remboursement', `${loan.duration} mois`],
            ['Taux Annuel Effectif Global (TAEG)', `${loan.rate}% Fixe`],
            ['Mensualité (Assurance incluse)', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loan.monthlyPayment)}`],
            ['Date de première échéance', loan.startDateFormatted || "À déterminer"],
            ['Coût total du crédit (intérêts + assurance)', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((loan.monthlyPayment * loan.duration) - loan.totalAmount)}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [0, 61, 130] },
        styles: { fontSize: 10, cellPadding: 4 },
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // Terms text
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("ARTICLE 1 - OBJET DU CONTRAT", leftX, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    doc.text("Le Prêteur consent à l'Emprunteur, qui accepte, un prêt personnel aux conditions financières stipulées ci-dessus. Les fonds seront débloqués par virement bancaire sur le compte désigné par l'Emprunteur après réception et validation de l'ensemble des pièces justificatives et expiration du délai légal de rétractation.", leftX, y, { maxWidth: 180, align: "justify" });

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("ARTICLE 2 - ASSURANCE EMPRUNTEUR", leftX, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    doc.text("L'Emprunteur adhère au contrat d'assurance groupe souscrit par le Prêteur, couvrant les risques de Décès, Perte Totale et Irréversible d'Autonomie (PTIA). Le coût de cette assurance est de 3% du montant emprunté, lissé sur la durée totale du prêt et intégré à la mensualité.", leftX, y, { maxWidth: 180, align: "justify" });

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("ARTICLE 3 - REMBOURSEMENT ANTICIPÉ", leftX, y);
    doc.setFont("helvetica", "normal");
    y += 5;
    doc.text("L'Emprunteur peut rembourser tout ou partie de son crédit par anticipation sans pénalité, conformément aux dispositions du Code de la Consommation.", leftX, y, { maxWidth: 180, align: "justify" });

    y += 20;

    // Signatures
    doc.setDrawColor(0, 0, 0);
    doc.rect(leftX, y, 80, 40); // Lender box
    doc.rect(rightX, y, 80, 40); // Borrower box

    doc.text("Pour le Prêteur", leftX + 5, y + 8);
    doc.text("AGM INVEST", leftX + 5, y + 14);
    doc.text("Signé électroniquement", leftX + 5, y + 35);

    doc.text("Pour l'Emprunteur", rightX + 5, y + 8);
    doc.text("Lu et approuvé", rightX + 5, y + 14);

    addHeaderFooter(doc, "Contrat de Prêt", contractRef);
    doc.save(`Contrat_Pret_${contractRef}.pdf`);
};


// --- Generator: Insurance Certificate ---
export const generateInsuranceCertificate = (client: any, loan: any) => {
    const doc = new jsPDF();
    const contractRef = `ASS-${loan.id.substring(0, 8).toUpperCase()}`;

    let y = 55;
    const leftX = 14;

    doc.setFontSize(14);
    doc.setTextColor(5, 150, 105); // ELY MINT COLOR-ish
    doc.text("ATTESTATION D'ASSURANCE EMPRUNTEUR", leftX, y);

    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Nous soussignés, AGM INVEST, certifions que :", leftX, y);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`${(client.civility || "M.")} ${client.firstName} ${client.lastName}`.toUpperCase(), leftX + 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Né(e) le ${client.birthDate || "..."}`, leftX + 10, y + 5);
    doc.text(`Demeurant à : ${client.address || "..."} ${client.zipCode || ""} ${client.city || ""}`, leftX + 10, y + 10);

    y += 25;
    doc.text("Est assuré(e) au titre du contrat de prêt référencé ci-dessous :", leftX, y);

    y += 10;
    autoTable(doc, {
        startY: y,
        head: [['Garanties', 'Montant Couvert', 'Quotité']],
        body: [
            ['Décès', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loan.totalAmount)}`, '100%'],
            ['Perte Totale et Irréversible d\'Autonomie (PTIA)', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loan.totalAmount)}`, '100%'],
            ['Incapacité Temporaire Totale de Travail (ITT)', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(loan.totalAmount)}`, '100%'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [5, 150, 105] }, // Greenish
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    doc.text("Cette attestation est délivrée pour servir et valoir ce que de droit.", leftX, y);

    y += 15;
    doc.text(`Fait à Mulhouse, le ${new Date().toLocaleDateString('fr-FR')}`, leftX, y);

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("AGM INVEST - Service Assurances", leftX, y);

    // Stamp placeholder
    doc.setDrawColor(5, 150, 105);
    doc.setLineWidth(1);
    doc.rect(leftX, y + 5, 50, 20);
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(8);
    doc.text("Document Validé", leftX + 12, y + 15);
    doc.text("AGM INVEST", leftX + 15, y + 19);

    addHeaderFooter(doc, "Attestation Assurance", contractRef);
    doc.save(`Attestation_Assurance_${contractRef}.pdf`);
};

// --- Generator: Privacy Policy ---
export const generatePrivacyPolicy = (client: any) => {
    const doc = new jsPDF();
    const docRef = `RGPD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;

    let y = 55;
    const leftX = 14;
    const maxWidth = 180;

    // Title
    doc.setFontSize(14);
    doc.setTextColor(0, 61, 130);
    doc.text("POLITIQUE DE CONFIDENTIALITÉ & RGPD", leftX, y);

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Document remis à : ${(client.civility || "M./Mme")} ${client.firstName} ${client.lastName}`, leftX, y);
    doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, leftX, y + 5);

    y += 15;

    // Sections
    const sections = [
        {
            title: "1. Engagement de Confidentialité",
            content: "AGM INVEST accorde une importance capitale à la sécurité de vos informations. Nous nous engageons à respecter scrupuleusement la réglementation en vigueur (RGPD) concernant la collecte et le traitement de vos données personnelles."
        },
        {
            title: "2. Données Collectées",
            content: "Dans le cadre de votre demande de financement, nous collectons : identité, coordonnées, situation familiale et professionnelle, ainsi que vos informations financières (revenus, charges, patrimoine). Ces données sont indispensables à l'étude de votre dossier."
        },
        {
            title: "3. Finalité du Traitement",
            content: "Vos données sont utilisées exclusivement pour : l'étude de solvabilité, la gestion de votre contrat de prêt, la lutte contre le blanchiment d'argent et la sécurisation de vos transactions. Elles ne sont jamais vendues à des tiers."
        },
        {
            title: "4. Vos Droits",
            content: "Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, vous pouvez contacter notre Délégué à la Protection des Données (DPO) à l'adresse : contact@agm-negoce.com."
        }
    ];

    sections.forEach(section => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 61, 130);
        doc.text(section.title, leftX, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const splitText = doc.splitTextToSize(section.content, maxWidth);
        doc.text(splitText, leftX, y);
        y += (splitText.length * 5) + 8;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("AGM INVEST - Délégué à la Protection des Données", leftX, y);

    // Stamp
    doc.setDrawColor(0, 61, 130);
    doc.setLineWidth(1);
    doc.rect(leftX, y + 5, 50, 20);
    doc.setTextColor(0, 61, 130);
    doc.setFontSize(8);
    doc.text("Conformité RGPD", leftX + 12, y + 15);
    doc.text("Validé", leftX + 20, y + 19);

    addHeaderFooter(doc, "Politique de Confidentialité", docRef);
    doc.save(`Politique_Confidentialite_${client.firstName}_${client.lastName}.pdf`);
};
