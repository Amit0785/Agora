import React, {useState} from 'javascriptv3/example_code/reactnative/App';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3';
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-provider-cognito-identity';

const App = () => {
  const [bucketName, setBucketName] = useState('qspace');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  //Cognito_comqspaceAuth_Role
  //Cognito_comqspaceUnauth_Role

  // Initialize the Amazon Cognito credentials provider
  // AWS.config.region = 'ap-northeast-1'; // Region
  // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //     IdentityPoolId: 'ap-northeast-1:755e873e-33d0-4231-8423-f3c229866404',
  // });

  // Replace REGION with the appropriate AWS Region, such as 'us-east-1'.
  const region = 'REGION';
  const client = new S3Client({
    region,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({region}),
      // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
      identityPoolId: 'ap-northeast-1:755e873e-33d0-4231-8423-f3c229866404',
    }),
  });

  const createBucket = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await client.send(new CreateBucketCommand({Bucket: bucketName}));
      setSuccessMsg(`Bucket "${bucketName}" created.`);
    } catch (e) {
      setErrorMsg(e);
    }
  };

  const deleteBucket = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await client.send(new DeleteBucketCommand({Bucket: bucketName}));
      setSuccessMsg(`Bucket "${bucketName}" deleted.`);
    } catch (e) {
      setErrorMsg(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{color: 'green'}}>
        {successMsg ? `Success: ${successMsg}` : ``}
      </Text>
      <Text style={{color: 'red'}}>{errorMsg ? `Error: ${errorMsg}` : ``}</Text>
      <View>
        <TextInput
          style={styles.textInput}
          onChangeText={text => setBucketName(text)}
          autoCapitalize={'none'}
          value={bucketName}
          placeholder={'Enter Bucket Name'}
        />
        <Button
          backroundColor="#68a0cf"
          title="Create Bucket"
          onPress={createBucket}
        />
        <Button
          backroundColor="#68a0cf"
          title="Delete Bucket"
          onPress={deleteBucket}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
