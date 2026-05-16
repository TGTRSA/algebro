import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";

type CustomKeyboardProps = {
    layout: string[][];
    onKeyPress: (key: string) => void;
}

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({onKeyPress, layout})=>{
    // const [value, setValue ] = useState('');

    // const onKeyPress = (key: string) => {
    //     if (key === 'del'){
    //         setValue(value.slice(0, -1));
    //     }else {
    //         setValue( value + key);
    //         console.log(key);
    //     }
    // };
    return (
        <View>
            {layout.map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                {row.map(key=>(
                    <TouchableOpacity
                        key={key}
                        onPress={() => onKeyPress(key)}
                        style={{padding: 20, margin: 5, backgroundColor: '#ddd' }}    
                    >
                        <Text>{key}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            ))}
        </View>
    );
} 