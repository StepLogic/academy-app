// import { useUIContext } from "@contexts/UIContext";
import { theme } from "@assets/theme";
import Button from "@components/common/Button";
import CommonLayout from "@components/common/CommonLayout";
import DateField from "@components/common/DateField";
import ItemCard from "@components/common/ItemCard";
import TextField from "@components/common/TextField";
import * as React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlatList, StyleSheet, View } from "react-native";
import tw from "twrnc";
import moment from "moment";
import { useNavigation } from "@react-navigation/core";
import { useAppContext } from "@api/context/AppContext";
import NoItemCard from "@components/common/NoItemCard";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";
const htmlContent = ({
  name,
  location,
  cap,
  citta,
  price,
  price_no_iva,
  iva,
  type,
  paid_for,
  data,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>edusogno_invoice_${name + " " + paid_for}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <style>
    @page{
      margin:80px;
    }
      html {
        width: 210mm;
        height: 280mm;
        box-sizing: border-box;
        color: #2d224c;
      }
      body {
        width: 210mm;
        height: 280mm;
        box-sizing: border-box;
        background: white;
        padding:4rem 1rem 0 1rem;
        display: flex;
        flex-direction: column;

        gap: 1.4rem;
        /* justify-content: space-between; */
        font-family: "Poppins", sans-serif;
      }
      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .header h1 {
        font-size: 20px;
        font-weight: bold;
        /* margin-bottom: 10px; */
        margin-top: 20px;
      }
      .header p {
        font-size: 20px;
        font-weight: 500;
        margin: 0;
      }
      .user {
        display: flex;
        flex-direction: column;
      }
      .user h1 {
        display: flex;
        flex-direction: column;
      }
      .user p {
        margin: 0;
      }
      .body {
        color: #2d224c;
        font-size: 24;
        font-weight: bold;
      }
      .netPrice {
        color: #2d224c;
        font-size: 28px;
        font-weight: bold;
      }
      .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: auto;
      }
      table {
        display: table;
        width: 100%;
        border: none;
      }
      table .head {
        background-color: #2d224c;
        color: white;
        border-spacing: 0;
        border-collapse: collapse;
        padding: 1rem 0;
        font-size: 24px;
      }
      tr {
        border-spacing: 0;
      }
      .info {
        border: #2d224c solid 1px;
      }
      td,
      th {
        display: table-cell;
        padding: 1rem;
        text-align: left;
        border-spacing: 0;
      }
      .content {
        display: flex;
        flex-direction: column;
        gap: 4rem;
      }
      a {
        text-decoration: none;
        color: #2d224c;
      }
    </style>
  </head>

  <body>
    <div class="header">
      <svg
        width="224"
        height="90"
        viewBox="0 0 124 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M63.858 16.6902V18.6471H50.9453C51.4426 18.198 51.6912 17.5243 51.6912 16.241V2.87118C51.6912 1.59595 51.4426 0.922246 50.9453 0.465088H63.5853V2.44611C63.1362 1.97291 62.5587 1.74834 61.2594 1.74834H57.0408V8.06834H59.9601C60.7668 8.14564 61.5746 7.93232 62.2379 7.46682V9.92104C61.5746 9.45554 60.7668 9.24222 59.9601 9.31952H57.0408V17.388H61.5161C62.7833 17.388 63.3848 17.1634 63.834 16.6902H63.858Z"
          fill="#2D224C"
        />
        <path
          d="M74.2833 18.6472L74.0828 16.4978C73.6552 17.243 73.0292 17.8549 72.2745 18.2656C71.5198 18.6762 70.666 18.8694 69.808 18.8237C67.1051 18.8237 64.9316 16.7464 64.9316 12.223C64.9316 7.6995 67.4821 5.6062 70.0085 5.6062C70.8326 5.59395 71.6451 5.80243 72.3615 6.21C73.0779 6.61756 73.6722 7.20938 74.0828 7.92407V2.74295C74.161 1.94623 73.9472 1.14825 73.4813 0.497262C74.6763 0.425079 77.6037 0.224569 79.3762 0V16.3935C79.3119 17.1963 79.5366 17.9956 80.0098 18.6472H74.2833ZM74.0828 14.9499V9.49605C73.9657 9.13791 73.738 8.82616 73.4325 8.60565C73.1269 8.38514 72.7593 8.26725 72.3825 8.26894C71.2035 8.26894 70.61 9.11909 70.586 12.2791C70.5619 15.4391 71.2035 16.2893 72.3825 16.2893C72.7716 16.2848 73.1485 16.1529 73.4556 15.914C73.7626 15.675 73.9829 15.342 74.0828 14.9659V14.9499Z"
          fill="#2D224C"
        />
        <path
          d="M90.1001 18.6471L89.9718 16.4977C89.5893 17.2423 88.9977 17.8591 88.2697 18.2722C87.5416 18.6854 86.7088 18.877 85.8734 18.8236C83.0502 18.8236 81.8632 17.2195 81.8632 14.2279V8.09239C81.91 7.76677 81.88 7.43472 81.7755 7.12278C81.6711 6.81084 81.4951 6.52765 81.2617 6.29584C83.0823 6.21564 85.2077 5.99107 87.1567 5.79858V14.3883C87.1567 15.3909 87.4053 16.217 88.4319 16.217C88.7089 16.2081 88.9773 16.1183 89.2039 15.9587C89.4305 15.7991 89.6055 15.5766 89.7071 15.3187V8.10041C89.7539 7.77479 89.7238 7.44275 89.6194 7.1308C89.515 6.81886 89.339 6.53567 89.1056 6.30386C90.9342 6.22366 93.0596 5.99909 95.0085 5.8066V16.3934C94.933 17.1963 95.1431 18.0001 95.602 18.6632L90.1001 18.6471Z"
          fill="#2D224C"
        />
        <path
          d="M61.5645 22.5691L60.9871 24.0689C60.0699 23.3527 58.9426 22.9581 57.779 22.9461C56.3032 22.9461 55.6295 23.323 55.6295 24.1972C55.6295 25.8655 62.2062 26.5392 62.2062 30.4932C62.2062 33.4928 59.5755 34.8643 55.3809 34.8643C53.6854 34.9604 51.9948 34.6062 50.4805 33.8377L51.0339 32.3619C52.0909 33.1183 53.3593 33.5224 54.6591 33.5169C56.2631 33.5169 56.9769 33.0677 56.9769 32.1133C56.9769 29.8917 50.5607 30.2446 50.4805 25.9457C50.4805 23.5396 52.3572 21.6227 57.1774 21.6227C58.6943 21.5841 60.1985 21.9085 61.5645 22.5691Z"
          fill="#2D224C"
        />
        <path
          d="M77.6045 28.2716C77.6045 31.8486 74.9338 34.8963 70.3863 34.8963C65.5741 34.8963 63.168 32.0732 63.168 28.2716C63.168 24.7025 65.8708 21.6548 70.3863 21.6548C75.1343 21.6227 77.6045 24.4459 77.6045 28.2716ZM68.7822 28.2716C68.7822 32.8993 69.2073 33.8858 70.3863 33.8858C71.5652 33.8858 71.9903 32.9153 71.9903 28.2716C71.9903 23.6278 71.5893 22.7055 70.3863 22.7055C69.1832 22.7055 68.7822 23.6198 68.7822 28.2716Z"
          fill="#2D224C"
        />
        <path
          d="M100.919 34.6878H107.44C106.974 34.0276 106.761 33.2223 106.838 32.4181V26.8039C106.838 23.7802 105.82 21.6067 102.467 21.6067C101.683 21.5742 100.905 21.7575 100.218 22.1365C99.5304 22.5154 98.9602 23.0757 98.5692 23.7561V21.7912C97.1175 21.9756 95.0723 22.3205 93.6768 22.529C91.8455 22.7725 89.9961 22.8504 88.1508 22.7616C87.0744 22.094 85.8119 21.7903 84.5497 21.8954C81.1812 21.8954 78.9355 23.9166 78.9355 26.3948C78.9387 27.1357 79.1396 27.8623 79.5175 28.4995C79.8953 29.1368 80.4364 29.6617 81.0849 30.02C80.5389 30.336 80.091 30.797 79.7908 31.3519C79.4907 31.9068 79.3501 32.534 79.3846 33.164C79.3735 33.5788 79.4451 33.9918 79.5952 34.3787C79.7453 34.7656 79.9709 35.1188 80.2588 35.4177C79.8578 35.5557 79.5089 35.8136 79.2593 36.1564C79.0097 36.4993 78.8714 36.9105 78.8633 37.3345C78.8633 38.9386 81.6062 39.7406 84.7823 39.7406C88.5598 39.7406 91.4792 38.289 91.4792 35.7305C91.4792 33.4768 89.6025 32.1053 84.8063 32.0331L82.4002 31.985C81.6544 31.985 81.4218 31.6562 81.4218 31.3033C81.4416 31.1248 81.5106 30.9553 81.6211 30.8137C81.7315 30.6721 81.8791 30.5639 82.0473 30.5012C82.8711 30.7675 83.7321 30.9002 84.5978 30.8942C88.0225 30.8942 90.2682 28.8731 90.2682 26.4269C90.3055 25.3579 89.9193 24.3173 89.1934 23.5316L93.4923 23.7401C93.548 24.0038 93.5749 24.2727 93.5725 24.5421V32.4421C93.65 33.2463 93.4366 34.0516 92.971 34.7119H99.4675C99.0019 34.0516 98.7885 33.2463 98.8659 32.4421V24.9191C99.0214 24.6903 99.2368 24.5086 99.4886 24.394C99.7404 24.2794 100.019 24.2363 100.294 24.2694C101.32 24.2694 101.569 25.0715 101.569 26.066V32.4181C101.632 33.2282 101.402 34.0341 100.919 34.6878ZM81.4779 35.9631L86.2901 36.1876C87.8942 36.2598 88.5117 36.5646 88.5117 37.142C88.5117 37.7195 87.6696 38.7461 84.7662 38.7461C83.3466 38.7461 81.3175 38.1927 81.3175 36.9736C81.2979 36.6292 81.3526 36.2845 81.4779 35.9631ZM84.5497 29.9639C83.6514 29.9639 83.2985 29.3142 83.3306 26.3948C83.3627 23.4754 83.6514 22.7937 84.5497 22.7937C85.448 22.7937 85.8009 23.4193 85.8009 26.3948C85.8009 29.3704 85.5041 29.9639 84.5497 29.9639Z"
          fill="#2D224C"
        />
        <path
          d="M123.136 28.2716C123.136 31.8486 120.457 34.8963 115.918 34.8963C111.105 34.8963 108.699 32.0732 108.699 28.2716C108.699 24.7025 111.394 21.6548 115.918 21.6548C120.658 21.6227 123.136 24.4459 123.136 28.2716ZM114.313 28.2716C114.313 32.8993 114.739 33.8858 115.918 33.8858C117.096 33.8858 117.522 32.9153 117.522 28.2716C117.522 23.6278 117.121 22.7055 115.918 22.7055C114.714 22.7055 114.338 23.6198 114.313 28.2716Z"
          fill="#2D224C"
        />
        <path
          d="M0 0.481201H45.0581V1.13085C45.0581 8.25289 45.1303 15.3669 45.0581 22.4809C44.9058 34.5114 39.5081 43.3338 28.9614 49.1004C27.1006 50.1109 25.2159 51.0653 23.3471 52.0599C23.1033 52.2006 22.8267 52.2748 22.5451 52.2748C22.2635 52.2748 21.9869 52.2006 21.7431 52.0599C19.6017 50.921 17.4281 49.8462 15.3268 48.6592C11.443 46.5867 8.08655 43.6507 5.51561 40.0773C2.94468 36.5038 1.22785 32.3882 0.49726 28.047C0.191221 26.3155 0.0409062 24.5601 0.0481215 22.8017C-4.27255e-07 15.5835 0.0481215 8.36517 0.0481215 1.14689L0 0.481201ZM2.34995 2.80709V3.33644C2.34995 9.82487 2.34995 16.3133 2.34995 22.8017C2.35348 24.1843 2.45802 25.5648 2.66274 26.9322C3.18763 30.7485 4.54803 34.4019 6.64694 37.6321C8.74585 40.8623 11.5316 43.5896 14.8055 45.6195C17.2116 47.1514 19.7701 48.3464 22.2724 49.6778C22.365 49.7173 22.4645 49.7377 22.5652 49.7377C22.6658 49.7377 22.7654 49.7173 22.8579 49.6778C24.0128 49.0923 25.1357 48.4587 26.2986 47.8813C29.75 46.2919 32.871 44.0661 35.4979 41.3206C40.064 36.4893 42.629 30.1068 42.6761 23.4594C42.7723 16.7544 42.6761 10.0494 42.6761 3.34445C42.6761 3.17603 42.6761 2.99958 42.6761 2.80709H2.34995Z"
          fill="#2D224C"
        />
        <path
          d="M25.5695 15.0942H18.4395V33.0196H25.5695V15.0942Z"
          fill="#2D224C"
        />
        <path
          d="M18.3249 21.7035L13.4609 19.9658L9.38105 31.3856L14.245 33.1233L18.3249 21.7035Z"
          fill="#2D224C"
        />
        <path
          d="M27.8172 11.1707L24.6562 12.335L32.2433 32.9337L35.4042 31.7695L27.8172 11.1707Z"
          fill="#2D224C"
        />
      </svg>
      <div>
        <h1>Edusogno Srl</h1>
        <p>Via Ospedale di Venere 82/b</p>
        <p>Bari (BA), 70131</p>
        <p>IT08587960728</p>
      </div>
    </div>
    <div class="content">
      <div class="user">
        <h1>${name}</h1>
        <p>${location},</p>
        <p>${citta} ${cap}</p>
      </div>
      <table cellspacing="0" class="body">
        <tr class="head">
          <th>Product</th>
          <th>Price</th>
          <th>Net Price</th>
        </tr>
        <tbody>
          <tr>
            <td>${paid_for}</td>
            <td>${price} €</td>
            <td>${price_no_iva} €</td>
          </tr>
          <tr>
            <td>Net Amount</td>
            <td>${price_no_iva} €</td>
            <td></td>
          </tr>
          <tr>
            <td>IVA (22%)</td>
            <td>${iva} €</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td class="netPrice">${price} €</td>
          </tr>
        </tbody>
      </table>

      <table class="info">
        <tbody>
          <tr>
            <td>Data di emissione:</td>
            <td>${data}</td>
          </tr>
          <tr>
            <td>Metodo di pagamento:</td>
            <td>${type}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <p>Edusogno Srl - P. IVA: IT08587960728</p>
      <p><a href="https://edusogno.com">edusogno.com</a></p>
      <p><a href="mailto:info@edusogno.com"></a>info@edusogno.com</p>
    </div>
  </body>
</html>
`;

const Invoice = () => {
  const navigate = useNavigation();
  const {
    user: {
      user: { payments },
      user,
    },
    setLoading,
  } = useAppContext();

  const printToFile = async ({
    price,
    price_no_iva,
    iva,
    type,
    paid_for,
    data,
  }) => {
    try {
      setLoading(true);
      const { uri } = await Print.printToFileAsync({
        html: htmlContent({
          name: user.nome + " " + user.cognome,
          location: user?.indirizzo,
          cap: user?.cap,
          citta: user?.citta,
          price,
          price_no_iva,
          iva,
          type,
          paid_for,
          data,
        }),
        height: 842,
        width: 595,
      });
      console.log("File has been saved to:", uri);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
      setLoading(false);
    } catch (e) {
      console.log("errot.pdf", e);
      setLoading(false);
    }
  };
  // console.log("items", user);

  const renderItem = React.useCallback(({ item, index }: any) => {
    const { paid_for, data, amount, type } = item;
    const price = amount;
    const price_no_iva = (price - (price / 100) * 18.0327868852459).toFixed(2);
    const iva = ((price / 100) * 18.0327868852459).toFixed(2);

    return (
      <ItemCard
        heading={paid_for}
        subHeading={moment(data).format("DD-MM-YYYY")}
        prompt="Amount"
        value={`€${amount}`}
        showButton
        onPress={() => {
          printToFile({ price, price_no_iva, iva, type, paid_for, data });
        }}
        buttonAffix={
          <FontAwesome5
            name="file-pdf"
            size={24}
            color={theme.colors.primary}
          />
        }
      />
    );
  }, []);
  return (
    <CommonLayout
      heading="Invoices"
      subHeading="Download the receipts of payments"
    >
      {payments && payments.length > 0 ? (
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          maxToRenderPerBatch={4}
          data={payments}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <View key={"item-sep"} style={{ height: 20 }} />
          )}
        />
      ) : (
        <NoItemCard heading=" No invoice is available for you" />
      )}
    </CommonLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.colors.white,
    borderRadius: 7,
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

export default Invoice;
