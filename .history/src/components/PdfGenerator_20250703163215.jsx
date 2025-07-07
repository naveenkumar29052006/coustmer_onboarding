import React, { memo, useMemo } from 'react';
import { Document, Page, Image, PDFViewer, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  fullPageImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  page: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingLeft: 40,
    paddingRight: 40,
  },
  titleRow: {
    flexDirection: 'row',
    marginBottom: 24,
    marginTop: 24,
    alignItems: 'baseline',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#222',
  },
  titleAccent: {
    color: '#FF8000',
    fontWeight: 'bold',
    fontSize: 36,
    marginLeft: 8,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#FF8000',
  },
  tableCellHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 8,
    borderRight: '1px solid #fff',
    borderBottom: '1px solid #fff',
    flex: 1,
    textAlign: 'left',
  },
  tableCellHeaderPrice: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 8,
    borderBottom: '1px solid #fff',
    flex: 1,
    textAlign: 'right',
  },
  tableCell: {
    fontSize: 14,
    padding: 8,
    borderRight: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    flex: 1,
    textAlign: 'left',
    backgroundColor: '#f7f7f7',
  },
  tableCellPrice: {
    fontSize: 14,
    padding: 8,
    borderBottom: '1px solid #e0e0e0',
    flex: 1,
    textAlign: 'right',
    backgroundColor: '#f7f7f7',
  },
  tableCellTotal: {
    fontWeight: 'bold',
    fontSize: 14,
    padding: 8,
    backgroundColor: '#e0e0e0',
    flex: 2,
    textAlign: 'left',
    borderRight: '1px solid #e0e0e0',
  },
  tableCellTotalPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    padding: 8,
    backgroundColor: '#e0e0e0',
    flex: 1,
    textAlign: 'right',
  },
  perMonth: {
    fontSize: 10,
    color: '#888',
    marginLeft: 4,
  },
});

const ServicesTable = memo(({ serviceDetails }) => {
  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableCellHeader}>S.No</Text>
        <Text style={styles.tableCellHeader}>Service</Text>
        <Text style={styles.tableCellHeader}>Option</Text>
        <Text style={styles.tableCellHeader}>Sub Option</Text>
      </View>
      {/* Rows */}
      {(serviceDetails || []).map((detail, idx) => (
        <View style={styles.tableRow} key={idx}>
          <Text style={styles.tableCell}>{idx + 1}</Text>
          <Text style={styles.tableCell}>{detail.service}</Text>
          <Text style={styles.tableCell}>{detail.option || '-'}</Text>
          <Text style={styles.tableCell}>{detail.sub_option || '-'}</Text>
        </View>
      ))}
    </View>
  );
});

const ProposalDocument = memo(({ formState }) => {
  const memoizedServiceDetails = useMemo(() =>
    formState?.serviceDetails || [],
    [formState?.serviceDetails]
  );

  return (
    <Document>
      {/* First page: page1.png */}
      <Page size="A4" style={styles.page}>
        <Image src="/page1.png" style={styles.fullPageImage} />
      </Page>
      {/* Middle page: services table */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentWrapper}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Selected</Text>
            <Text style={styles.titleAccent}>Services</Text>
          </View>
          <ServicesTable serviceDetails={memoizedServiceDetails} />
        </View>
      </Page>
      {/* Last page: page3.png */}
      <Page size="A4" style={styles.page}>
        <Image src="/page3.png" style={styles.fullPageImage} />
      </Page>
    </Document>
  );
});

const PdfGenerator = memo(({ formState }) => {
  const memoizedDocument = useMemo(() =>
    <ProposalDocument formState={formState} />,
    [formState]
  );

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div
        className="w-full border shadow-lg relative"
        style={{
          maxWidth: '1000px',
          width: '100%',
          height: '660px',
          maxHeight: '660px'
        }}
      >
        <PDFViewer
          width="100%"
          height="100%"
          showToolbar={false}
          style={{
            border: 'none',
            width: '100%',
            height: '100%'
          }}
        >
          {memoizedDocument}
        </PDFViewer>
      </div>
    </div>
  );
});

// Simplified PDF blob generation without causing re-renders
export const generatePdfBlob = async (formState) => {
  try {
    const doc = <ProposalDocument formState={formState} />;
    const blob = await pdf(doc).toBlob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF blob:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export default PdfGenerator;