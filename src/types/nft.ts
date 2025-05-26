export interface OpenSeaAttribute {
  trait_type: string;
  value: string | number;
  display_type?: "number" | "boost_percentage" | "boost_number" | "date";
  max_value?: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: OpenSeaAttribute[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  created_at?: string;
  creator?: string;
  version?: string;
}
