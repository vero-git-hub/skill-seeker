import { Devvit } from "@devvit/public-api";

export const BackgroundImage = ({ url, description }: { url: string; description: string }) => (
    <image
      url={url}
      description={description}
      imageWidth={800}
      imageHeight={600}
      width="100%"
      height="100%"
      resizeMode="cover"
    />
  );
  