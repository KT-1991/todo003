export const LOCAL_STORAGE = {
    COLOR: "todo_color",
}

export const DIALOG_TYPE = {
    ERROR: "error",
    ALERT: "alert",
    INFO: "info",
}

export const RESPONSE_TYPE = {
    OK: "close",
    CANCEL: "cancel",
}

export const BUTTON_TYPE = {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    TERTIARY: "tertiary",
}
export const BUTTON_SIZE = {
    SHORT: "short",
    LONG: "long",
    THIN: "thin",
}

export const FONT_TYPE = {
    UI_LARGE: "Oswald-VariableFont_wght",
    UI_SMALL: "YDWbananaslipplus",
    MAIN_SENTENSE: "NotoSansJP-Regular",
}

export const SQL_TEXT = {
    TABLE_INFO_CATEGORY: "PRAGMA table_info(ms_category);",
    SELECT_CATEGORY: `
        SELECT 
            mc.id as id,
            mc.name as name,
            dc.created_at as delete_at
        FROM 
            ms_category mc 
        LEFT JOIN 
            d_ms_category dc 
        ON 
            mc.id = dc.id 
        WHERE
            delete_at IS NULL
    `,
    INIT_CATEGORY: [
        "INSERT INTO ms_category (name) VALUES ('書類作成')",
        "INSERT INTO ms_category (name) VALUES ('書類提出')" ,
        "INSERT INTO ms_category (name) VALUES ('その他')" 
    ],
}

export const TABLE_INFO = {
    "MS_CATEGORY": [
        "id",
        "name",
        "created_at"
    ],

}
export const COLOR_TYPE = {
    primary: "primary" as string,
    primaryHeavy: "primaryHeavy" as string,
    secondary: "secondary",
    secondaryHeavy: "secondaryHeavy",
    background: "background",
    error: "error",
    onPrimary: "onPrimary",
    onPrimaryHeavy: "onPrimaryHeavy",
    onSecondary: "onSecondary",
    onSecondaryHeavy: "onSecondaryHeavy",
    onBackground: "onBackground",
    onError: "onError",
    gray: "gray"
}

export const COLOR_INFO: {[id: string]: {id: string,
                                        name: string, 
                                        color: {
                                                primary : string,
                                               primaryHeavy: string,  
                                               secondary: string,
                                               secondaryHeavy: string,
                                               background: string,
                                               error: string,
                                               onPrimary: string,
                                               onPrimaryHeavy: string,
                                               onSecondary: string,
                                               onSecondaryHeavy: string,
                                               onBackground: string,
                                               onError: string,
                                               gray: string         
                                            }
}} = {
    "test": {id: "test",
                name: "テスト", 
                color: {
                    primary : "#b1bbc3ff",
                    primaryHeavy: "#435168ff",
                    secondary: "#8f94adff",
                    secondaryHeavy: "#2f3257ff",
                    background: "#ffffffff",
                    error: "#FF0000",
                    onPrimary: "#000000",
                    onPrimaryHeavy: "#FFFFFF",
                    onSecondary: "#000000",
                    onSecondaryHeavy: "#FFFFFF",
                    onBackground: "rgba(49, 34, 34, 1)",
                    onError: "#FFFFFF",
                    gray: "#dcd9cfff"
                }   
            }, 
    "light": {id: "light",
                name: "ライト", 
                color: {
                    primary : "#ECEFF1",
                    primaryHeavy: "#B0BEC5",
                    secondary: "#EFEBE9",
                    secondaryHeavy: "#D7CCC8",
                    background: "#FFFFFF",
                    error: "#FF0000",
                    onPrimary: "#000000",
                    onPrimaryHeavy: "#000000",
                    onSecondary: "#000000",
                    onSecondaryHeavy: "#000000",
                    onBackground: "#000000",
                    onError: "#FFFFFF",
                    gray: "#AAAAAA"
                }   
            }, 
    "dark": {id: "dark",
                name: "ダーク", 
                color: {
                    primary : "#263238",
                    primaryHeavy: "#37474F",
                    secondary: "#212121",
                    secondaryHeavy: "#424242",
                    background: "#000000",
                    error: "#FF0000",
                    onPrimary: "#FFFFFF",
                    onPrimaryHeavy: "#FFFFFF",
                    onSecondary: "#FFFFFF",
                    onSecondaryHeavy: "#FFFFFF",
                    onBackground: "#FFFFFF",
                    onError: "#FFFFFF",
                    gray: "#AAAAAA"
                }   
            }, 
}
export const CATEGORY_COLOR_INFO: {[id: string]: {id: string,
                                        name: string, 
                                        color: string,
                                        heavyColor: string,
                                        textColor: string}
} = {
    "category_color_01": {
        id:    "category_color_01",
        name: "red",
        color: "#FFEBEE",
        heavyColor: "#FFCDD2",
        textColor: "#000000"
    },
    "category_color_02": {
        id:    "category_color_02",
        name: "green",
        color: "#FCE4EC",
        heavyColor: "#F8BBD0",
        textColor: "#000000"
    },
    "category_color_03": {
        id:    "category_color_03",
        name: "blue",
        color: "#F3E5F5",
        heavyColor: "#E1BEE7",
        textColor: "#000000"
    },
    "category_color_04": {
        id:    "category_color_04",
        name: "blue",
        color: "#EDE7F6",
        heavyColor: "#D1C4E9",
        textColor: "#000000"
    },
    "category_color_05": {
        id:    "category_color_05",
        name: "blue",
        color: "#E8EAF6",
        heavyColor: "#D1C4E9",
        textColor: "#000000"
    },
    "category_color_06": {
        id:    "category_color_06",
        name: "blue",
        color: "#E3F2FD",
        heavyColor: "#BBDEFB",
        textColor: "#000000"
    },
    "category_color_07": {
        id:    "category_color_07",
        name: "blue",
        color: "#E1F5FE",
        heavyColor: "#B3E5FC",
        textColor: "#000000"
    },
    "category_color_08": {
        id:    "category_color_08",
        name: "blue",
        color: "#E3F2FD",
        heavyColor: "#B2EBF2",
        textColor: "#000000"
    },
    "category_color_09": {
        id:    "category_color_09",
        name: "blue",
        color: "#E0F2F1",
        heavyColor: "#B2DFDB",
        textColor: "#000000"
    },
    "category_color_10": {
        id:    "category_color_10",
        name: "blue",
        color: "#E8F5E9",
        heavyColor: "#C8E6C9",
        textColor: "#000000"
    },
    "category_color_11": {
        id:    "category_color_11",
        name: "blue",
        color: "#F1F8E9",
        heavyColor: "#DCEDC8",
        textColor: "#000000"
    },
    "category_color_12": {
        id:    "category_color_12",
        name: "blue",
        color: "#F9FBE7",
        heavyColor: "#F0F4C3",
        textColor: "#000000"
    },
    "category_color_13": {
        id:    "category_color_13",
        name: "blue",
        color: "#FFFDE7",
        heavyColor: "#FFF9C4",
        textColor: "#000000"
    },
    "category_color_14": {
        id:    "category_color_14",
        name: "blue",
        color: "#FFF8E1",
        heavyColor: "#FFECB3",
        textColor: "#000000"
    },
    "category_color_15": {
        id:    "category_color_15",
        name: "blue",
        color: "#FFECB3",
        heavyColor: "#FFE0B2",
        textColor: "#000000"
    },
    "category_color_16": {
        id:    "category_color_16",
        name: "blue",
        color: "#FBE9E7",
        heavyColor: "#FFCCBC",
        textColor: "#000000"
    },
    "category_color_17": {
        id:    "category_color_17",
        name: "blue",
        color: "#EFEBE9",
        heavyColor: "#D7CCC8",
        textColor: "#000000"
    },
    "category_color_18": {
        id:    "category_color_18",
        name: "blue",
        color: "#FAFAFA",
        heavyColor: "#F5F5F5",
        textColor: "#000000"
    },
    "category_color_19": {
        id:    "category_color_19",
        name: "blue",
        color: "#ECEFF1",
        heavyColor: "#CFD8DC",
        textColor: "#000000"
    },
}