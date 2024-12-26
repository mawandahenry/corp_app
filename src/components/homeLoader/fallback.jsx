import {Skeleton} from '@rneui/themed';
import React from 'react';
import {FlatList, View} from 'react-native';
import normalize from 'react-native-normalize';

import styles from './styles';

const Fallback = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={Array(16).fill('a')}
        contentContainerStyle={styles.content1}
        showsVerticalScrollIndicator={false}
        numColumns={4}
        renderItem={() => (
          <View style={styles.imageWrapper1}>
            <Skeleton
              animation="pulse"
              width={normalize(80)}
              height={normalize(80)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
              skeletonStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Fallback;
