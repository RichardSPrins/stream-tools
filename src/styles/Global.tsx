import { Global } from "@mantine/core";

export const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor:
            theme.colorScheme === "dark" ? "#000000" : theme.white,
        },
      })}
    />
  );
};
