import { Box } from "@mui/material";

export const Page = ({ children }: { children: React.ReactNode }) => {
    return  <Box flex={1} height="100vh" className="bg-background">
            {children}
        </Box>
};