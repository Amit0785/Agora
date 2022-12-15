import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import RecordScreen from 'react-native-record-screen';

const ScreenRecording = () => {
  useEffect(() => {
    return () => {
      RecordScreen.clean();
    };
  }, []);

  const startRecording = () => {
    RecordScreen.startRecording().catch(error => console.error(error));
  };

  const stopRecording = async () => {
    const res = await RecordScreen.stopRecording().catch(error =>
      console.warn(error),
    );
    if (res) {
      const url = res.result.outputURL;
      console.log('Recording url==>', url);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center', padding: 20}}>
      <Text>ScreenRecording</Text>
      <TouchableOpacity
        onPress={() => {
          startRecording();
        }}
        style={{
          width: 150,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
          backgroundColor: 'peru',
        }}>
        <Text>Start Recording</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          stopRecording();
        }}
        style={{
          width: 150,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10,
          backgroundColor: 'peru',
        }}>
        <Text>Stop Recording</Text>
      </TouchableOpacity>
      <Text>
        Hello this is Screen Recording.lorem jdbncdkjnkc;lsklcsnndvknvdfskl
        mdv;ldvm dvms;lmdvl;v bmfe;l,mb;lbb;l
        lb,mg;lbg,bg;l,mgn;lnmnlmgnmgn;lngm;nlmgn
        flb,;lbg,mbg;lbgmbgklrmnjrvklmvlv,sklvfnvl,mvfs;lvmfklvfnvfs;l,bfvobnfkvmv;l
        vksnbfskbmf;lbgmbdgklmbdklbdmbfklsndvaskjbnvklmbvfsl;bmfsklbfsnpklvsb;flsnkjmnvfsrplkrg
        nrtgklgjfldfmporpmfls;psmdkf
        fkwnvfklvmbg,m;lbrg,,oikcdvenvfe,bporgkjoivnvklbrgekn
        vklevvfkebgjbtgekbtvfem
        kngeklfembgkle,brgn';l,rhnpobge,;'bthe.'y;kyjol;,yj';.
      </Text>
    </SafeAreaView>
  );
};

export default ScreenRecording;

const styles = StyleSheet.create({});
