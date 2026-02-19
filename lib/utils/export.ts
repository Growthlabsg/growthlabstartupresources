'use client'

// Dynamic imports to avoid SSR issues

interface Section {
  title: string
  content: string
}

interface PlanData {
  name: string
  sections: Section[]
  industry?: string | null
}

export async function exportToPDF(planData: PlanData) {
  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Title Page
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(planData.name, maxWidth)
  doc.text(titleLines, margin, yPosition, { align: 'center' })
  yPosition += titleLines.length * 10 + 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  if (planData.industry) {
    doc.text(`Industry: ${planData.industry}`, margin, yPosition, { align: 'center' })
    yPosition += 10
  }
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition, { align: 'center' })
  yPosition += 20

  // Table of Contents
  doc.addPage()
  yPosition = margin
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Table of Contents', margin, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  planData.sections.forEach((section, index) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage()
      yPosition = margin
    }
    doc.text(`${index + 1}. ${section.title}`, margin + 5, yPosition)
    yPosition += 8
  })

  // Sections
  planData.sections.forEach((section, index) => {
    doc.addPage()
    yPosition = margin

    // Section Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    const sectionTitleLines = doc.splitTextToSize(`${index + 1}. ${section.title}`, maxWidth)
    doc.text(sectionTitleLines, margin, yPosition)
    yPosition += sectionTitleLines.length * 8 + 5

    // Section Content
    if (section.content && section.content.trim()) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const contentLines = doc.splitTextToSize(section.content, maxWidth)
      
      contentLines.forEach((line: string) => {
        checkPageBreak(8)
        doc.text(line, margin, yPosition)
        yPosition += 7
      })
    } else {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(128, 128, 128)
      doc.text('This section has not been completed yet.', margin, yPosition)
      doc.setTextColor(0, 0, 0)
      yPosition += 7
    }

    yPosition += 5
  })

  // Footer on all pages
  const totalPages = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
    doc.text(
      planData.name,
      margin,
      pageHeight - 10
    )
    doc.setTextColor(0, 0, 0)
  }

  // Save the PDF
  doc.save(`${planData.name.replace(/\s/g, '-')}.pdf`)
}

export async function exportToDOCX(planData: PlanData) {
  // Dynamic import to avoid SSR issues
  const docxModule = await import('docx')
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docxModule
  
  const children: InstanceType<typeof Paragraph>[] = []

  // Title Page
  children.push(
    new docxModule.Paragraph({
      text: planData.name,
      heading: docxModule.HeadingLevel.TITLE,
      alignment: docxModule.AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  )

  if (planData.industry) {
    children.push(
      new docxModule.Paragraph({
        children: [
          new docxModule.TextRun({
            text: `Industry: ${planData.industry}`,
            size: 24,
          }),
        ],
        alignment: docxModule.AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
  }

  children.push(
    new docxModule.Paragraph({
      children: [
        new docxModule.TextRun({
          text: `Generated: ${new Date().toLocaleDateString()}`,
          size: 20,
        }),
      ],
      alignment: docxModule.AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  )

  // Page Break
  children.push(
    new docxModule.Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  )

  // Table of Contents
  children.push(
    new docxModule.Paragraph({
      text: 'Table of Contents',
      heading: docxModule.HeadingLevel.HEADING_1,
      spacing: { after: 200 },
    })
  )

  planData.sections.forEach((section, index) => {
    children.push(
      new docxModule.Paragraph({
        children: [
          new docxModule.TextRun({
            text: `${index + 1}. ${section.title}`,
            size: 22,
          }),
        ],
        spacing: { after: 120 },
      })
    )
  })

  // Sections
  planData.sections.forEach((section, index) => {
    // Page Break before each section (except first)
    if (index > 0) {
      children.push(
        new docxModule.Paragraph({
          text: '',
          pageBreakBefore: true,
        })
      )
    }

    // Section Title
    children.push(
      new docxModule.Paragraph({
        text: `${index + 1}. ${section.title}`,
        heading: docxModule.HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    )

    // Section Content
    if (section.content && section.content.trim()) {
      // Split content by lines and create paragraphs
      const contentLines = section.content.split('\n').filter(line => line.trim())
      
      if (contentLines.length > 0) {
        contentLines.forEach((line) => {
          children.push(
            new docxModule.Paragraph({
              children: [
                new docxModule.TextRun({
                  text: line.trim(),
                  size: 22,
                }),
              ],
              spacing: { after: 120 },
            })
          )
        })
      } else {
        children.push(
          new docxModule.Paragraph({
            children: [
              new docxModule.TextRun({
                text: section.content,
                size: 22,
              }),
            ],
            spacing: { after: 200 },
          })
        )
      }
    } else {
      children.push(
        new docxModule.Paragraph({
          children: [
            new docxModule.TextRun({
              text: 'This section has not been completed yet.',
              italics: true,
              color: '808080',
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        })
      )
    }
  })

  const doc = new docxModule.Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  // Generate and download the DOCX file
  const blob = await docxModule.Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${planData.name.replace(/\s/g, '-')}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

