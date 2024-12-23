import { FormData } from "@/types/formData";
import {
  Document,
  Font,
  Image,
  Page as PDFPage,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import path from "path";

// Register fonts
Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: path.resolve("./public/fonts/NotoSansJP-Regular.ttf"),
    },
    {
      src: path.resolve("./public/fonts/NotoSansJP-Bold.ttf"),
      fontWeight: "bold",
    },
  ],
});

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "NotoSansJP",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  image: {
    marginVertical: 10,
    width: 100,
    height: 100,
    objectFit: "contain",
  },
});

const renderImage = (level: number) => {
  switch (level) {
    case 1:
      return path.resolve("./public/icons/1.png");
    case 2:
      return path.resolve("./public/icons/2.png");
    case 3:
      return path.resolve("./public/icons/3.png");
    case 4:
      return path.resolve("./public/icons/4.png");
    default:
      return "";
  }
};

const PDFDocument = ({ formData }: { formData: FormData }) => (
  <Document>
    <PDFPage size='A4' style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>利用ガイドライン</Text>
        <Text style={styles.text}>
          権利継承: {formData.inheritanceRights ? "あり" : "なし"}
        </Text>
        <Text style={styles.text}>
          使用レベル1: レベル {formData.usageLevel1}
        </Text>
        {renderImage(formData.usageLevel1) && (
          <Image style={styles.image} src={renderImage(formData.usageLevel1)} />
        )}
        <Text style={styles.text}>
          使用レベル2: レベル {formData.usageLevel2}
        </Text>
        {renderImage(formData.usageLevel2) && (
          <Image style={styles.image} src={renderImage(formData.usageLevel2)} />
        )}
        <Text style={styles.text}>
          使用レベル3: レベル {formData.usageLevel3}
        </Text>
        {renderImage(formData.usageLevel3) && (
          <Image style={styles.image} src={renderImage(formData.usageLevel3)} />
        )}
        <Text style={styles.text}>
          使用レベル4: レベル {formData.usageLevel4}
        </Text>
        {renderImage(formData.usageLevel4) && (
          <Image style={styles.image} src={renderImage(formData.usageLevel4)} />
        )}
        <Text style={styles.text}>自由記述:</Text>
        {formData.freeDescriptions.map((desc, index) => (
          <Text key={index} style={styles.text}>
            {index + 1}. {desc.content}
          </Text>
        ))}
        <Text style={styles.text}>連絡先:</Text>
        {formData.contactInfos.map((contact, index) => (
          <Text key={index} style={styles.text}>
            {index + 1}. {contact.info}
          </Text>
        ))}
      </View>
    </PDFPage>
  </Document>
);

export default PDFDocument;
