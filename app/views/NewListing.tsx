import { MaterialCommunityIcons } from "@expo/vector-icons";
import DatePicker from "@ui/DatePicker";
import FormInput from "@ui/FormInput";
import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import OptionModal from "@components/OptionModal";
import colors from "@utils/colors";
import categories from "@utils/categories";
import CategoryOption from "@ui/CategoryOption";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import HorizontalImageList from "@components/HorizontalImageList";
import { newProductSchema, yupValidate } from "@utils/validator";
import useClient from "app/hooks/useClient";
import mime from "mime";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import LoadingAnimation from "@ui/LoadingAnimation";
interface Props {}

const defaultProductInfo = {
  name: "",
  price: "",
  purchasingDate: new Date(),
  category: "",
  description: "",
};

const imageOptions = [
  {
    value: "Remove Image",
    id: "remove-image",
  },
];

const NewListing: FC<Props> = (props) => {
  const [productInfo, setProductInfo] = useState({ ...defaultProductInfo });
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { name, price, purchasingDate, category, description } = productInfo;
  const { authClient } = useClient();
  const [busy, setBusy] = useState(false);
  const handleChange = (name: string) => (value: string) =>
    setProductInfo({ ...productInfo, [name]: value });

  const handleSubmit = async () => {
    const { error } = await yupValidate(newProductSchema, productInfo);
    if (error) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }

    const form = new FormData();

    type productInfoKeys = keyof typeof productInfo;

    for (let key in productInfo) {
      const value = productInfo[key as productInfoKeys];

      if (value instanceof Date) form.append(key, value.toISOString());
      else form.append(key, value);
    }

    const newImages = images.map((img, index) => {
      return {
        name: `image-${index}`,
        type: mime.getType(img),
        uri: img,
      };
    });

    for (let img of newImages) {
      form.append("images", img as any);
    }

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.post("/product/list", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    setBusy(false);

    if (res) {
      showMessage({
        message: res.message,
        type: "success",
      });
      setProductInfo({ ...defaultProductInfo });
      setImages([]);
    }
  };

  const handleImageSelection = async () => {
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.3,
        aspect: [4, 3],
        allowsMultipleSelection: true,
      });

      if (!assets) return;

      const imageUris = assets.map((asset) => asset.uri);

      setImages([...imageUris, ...images]);
    } catch (error) {
      showMessage({
        message: (error as any).message,
        type: "danger",
      });
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Pressable
            style={{ marginBottom: 20, justifyContent: "center" }}
            onPress={handleImageSelection}
          >
            <View style={styles.fileSelector}>
              <MaterialCommunityIcons
                name="folder-multiple-image"
                size={26}
                color="black"
              />
            </View>
            <Text style={{ fontSize: 12, marginTop: 5 }}>Add Images</Text>
          </Pressable>
          <HorizontalImageList
            images={images}
            onLongPress={(item) => {
              setSelectedImage(item);
              setShowImageOptions(true);
            }}
          />
        </View>

        <FormInput
          placeholder="Product Name"
          onChangeText={handleChange("name")}
          value={name}
        />
        <FormInput
          placeholder="Price"
          onChangeText={handleChange("price")}
          value={price}
        />
        <DatePicker
          title="Purchase date:"
          value={purchasingDate}
          onChange={(date) =>
            setProductInfo({ ...productInfo, purchasingDate: date })
          }
        />
        <OptionModal
          visible={showImageOptions}
          onRequestClose={setShowImageOptions}
          options={imageOptions}
          RenderItem={(item) => (
            <Text style={styles.imageOptions}>{item.value}</Text>
          )}
          onPress={(option) => {
            if (option.id === "remove-image") {
              setImages(images.filter((image) => image !== selectedImage));
            }
            setShowModal(false);
          }}
        />
        <OptionModal
          visible={showModal}
          onRequestClose={setShowModal}
          options={categories}
          RenderItem={(item) => (
            <CategoryOption icon={item.icon} name={item.name} />
          )}
          onPress={(item) => {
            setProductInfo({ ...productInfo, category: item.name });
            setShowModal(false);
          }}
        />
        <Pressable
          style={styles.categorySelector}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.categoryTitle}>
            {category || "Select Category"}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={26} color="black" />
        </Pressable>

        <FormInput
          placeholder="Description"
          multiline
          numberOfLines={4}
          onChangeText={handleChange("description")}
          value={description}
        />
        <AppButton
          title="Submit"
          onPress={() => {
            handleSubmit();
            // setProductInfo({ ...defaultProductInfo });
          }}
        />
      </View>
      <LoadingAnimation visible={busy} />
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  fileSelector: {
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  category: {
    color: colors.primary,
    paddingVertical: 10,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
  selectedImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  imageOptions: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.primary,
    padding: 10,
  },
});

export default NewListing;
