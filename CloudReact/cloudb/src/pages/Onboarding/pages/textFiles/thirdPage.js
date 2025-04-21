export const steps = [
    {
        number: 1,
        instruction: 'Go to <a href="google.com"><b>Cost and Usage Reports</b></a> in the Billing Dashboard and click on <strong>Create report.</strong>'
    },
    {
        number: 2,
        instruction: 'In the <strong>Name</strong> field, enter below-mentioned policy name and click on Create Policy',
        hasCopyableText: true,
        copyableText: "ck-tuner-275595855473-hourly-cur",
        textareaClass: "name-field-textarea",
        buttonClass: "name-field-copy-button",
        hasNote: true,
        noteText: "Ensure that the following configuration is checked",
        hasCheckbox: true,
        checkboxLabel: "Include resource IDs",
        hasAdditionalText: true,
        additionalText: "Click on <b>Next</b>",
        hasImage: true,
        imageSrc: 'report',
        imageAlt: 'report details image',
        imageClass: 'cktuner-image'
    },
    {
        number: 3,
        instruction: 'In the <strong>Name</strong> field, enter below-mentioned policy name and click on Create Policy',
        hasNote: true,
        noteText: "Ensure that the following configuration is checked",
        hasCheckbox: true,
        checkboxLabel: "The following default policy will be applied to your bucket",
        hasAdditionalText: true,
        additionalText: "Click on <b>Save</b>",
        hasImage: true,
        imageSrc: 'delivery',
        imageAlt: 'delivery options image',
        imageClass: 'cktuner-image'
    },
    {
        number: 4,
        instruction: 'In the <strong>Name</strong> field, enter below-mentioned policy name and click on Create Policy',
        hasCopyableText: true,
        copyableText: "ck-tuner-275595855473-hourly-cur",
        textareaClass: "name-field-textarea",
        buttonClass: "name-field-copy-button",
        hasNote: true,
        noteText: "Please make sure these checks are Enabled in Enable report data integration for:",
        hasCheckbox: true,
        checkboxLabel: "Amazon Athena",
        hasImage: true,
        imageSrc: 'delivery2',
        imageAlt: 'delivery options detail image',
        imageClass: 'cktuner-image'
    },
    {
        number: 5,
        instruction: 'Click on <strong>Next.</strong> Now, review the configuration of the Cost and Usage Report. Once satisfied, click on <strong>Create Report.</strong>'
    }
];