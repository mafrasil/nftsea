import { OpenSeaAttribute } from "@/types/nft";

export const formatAttributeValue = (attr: OpenSeaAttribute): string => {
  if (attr.display_type === "date") {
    return new Date(Number(attr.value) * 1000).toLocaleDateString();
  }
  if (attr.display_type === "boost_percentage") {
    return `+${attr.value}%`;
  }
  if (attr.display_type === "boost_number") {
    return `+${attr.value}`;
  }
  return attr.value.toString();
};

export const getTraitStyle = (attr: OpenSeaAttribute): string => {
  switch (attr.display_type) {
    case "boost_percentage":
    case "boost_number":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "number":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "date":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};
