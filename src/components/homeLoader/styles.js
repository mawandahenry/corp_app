import {StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

const styles = StyleSheet.create({
  imageWrapper1: {
    // width: normalize(80),
    // height: normalize(130),
    margin: normalize(5),
    borderRadius: normalize(15),
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageWrapper2: {
    width: normalize(120),
    height: normalize(130),
    margin: normalize(5),
    alignItems: 'center',
  },
  content1: {
    marginBottom: normalize(8),
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  content2: {
    marginTop: normalize(10),
    flex: 1,
  },
});

export default styles;
