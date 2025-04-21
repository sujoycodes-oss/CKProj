export const formFields = [
    {
        label: "Account Name",
        name: "accountName",
        type: "text",
        placeholder: "Enter account name",
        validate: (value) => {
            if (!value) return "Account name is required";
            return null;
        }
    },
    {
        label: "Account ID",
        name: "accountId",
        type: "text",
        placeholder: "Enter account ID",
        validate: (value) => {
            if (!value) return "Account ID is required";
            if (!/^\d+$/.test(value)) return "Account ID must contain only numbers";
            return null;
        }
    },{
        label: "Region",
        name: "region",
        type: "text",
        placeholder: "Enter AWS region (e.g., us-east-1)",
        validate: (value) => {
            if (!value) return "Region is required";
            if (!/^[a-z]{2}-[a-z]+-\d+$/.test(value)) return "Invalid region format (e.g., us-east-1)";
            return null;
        }
    },
    {
        label: "ARN",
        name: "arn",
        type: "text",
        placeholder: "Paste your ARN here",
        validate: (value) => {
            if (!value) return "ARN is required";
            if (!value.startsWith("arn:aws:")) return "Invalid ARN format";
            return null;
        }
    }
];

export default formFields;
