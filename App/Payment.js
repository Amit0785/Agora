import React, { Component } from 'react';
import {

    View,
    StyleSheet,
    Dimensions,
    Image,
    BackHandler,
    AsyncStorage,
    FlatList,
    ScrollView,
    Animated,
    ImageBackground,
    Alert,
    RefreshControl,
    TouchableWithoutFeedback,
    StatusBar,
    CheckBox,
    TextInput,
    Modal,
    Pressable,
    Button
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Item, Input, Icon, Text, List, ListItem, Body, Left, Right, Thumbnail, Tab, Tabs, Badge } from 'native-base';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import Carousel from 'react-native-banner-carousel';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import AwesomeAlert from 'react-native-awesome-alerts';
import AnimatedLoader from 'react-native-animated-loader';
import RNExitApp from 'react-native-exit-app';
import CustomTab from '../../CustomTab';
import CustomHeader from '../../CustomeHeader';
import MyThemeContext from '../../MyThemeContext';
import MyLangContext from '../../MyLangContext';
import b from '../../BaseUrl';
import { IMAGE } from '../../../constants/Image';
import { NavigationEvents } from 'react-navigation';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
const { width, height } = Dimensions.get('window');
const horizontalMargin = 1;
const slideWidth = 300;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 0.1;
const itemHeight = 200;
import Stripe from 'react-native-stripe-api';

const Entities = require('html-entities').XmlEntities;
const Context = React.createContext('default value');

//const entities = new Entities();
class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planId: '',
            planName: '',
            planAmount: '',
            planType: '',
            userEmail: '',
            planFeature: [],
            addmodalVisible: false,
            updatemodalVisible: false,
            isLoading: false,
            cardno: '',
            expdate: '',
            cvc: '',
            cardnou: '',
            expdateu: '',
            cvcu: '',
            checkfetchcard: false,
            last4: '',
            tokenId: '',
        };
    }

    componentDidMount() {
        this.handleConnectionChange();
        const { navigation } = this.props;
        this.fetchSaveCard();
        this.planDetails();

    }

    payment = async () => {
        const apiKey = 'pk_test_51J9tA6LsRntyE5tmeHzeaUHKSxe58KGENUCJoEA6W9VJ2tOSj2KieAEtaG0tiYv9DVRRqSR9Fv3lozvNo9VVHfGL00v0KcTTOQ';
        const client = new Stripe(apiKey);
        // Create a Stripe token with new card infos
        const token = await client.createToken({
            number: '4242424242424242',
            exp_month: '09',
            exp_year: '22',
            cvc: '111',
        });

        console.log(token, 'card token from stripe');

    }

    fetchSaveCard = async () => {
        AsyncStorage.getItem('language', (err, languageres) => {
            //console.log(languageres + "language from home screen");

            // if (languageres == '' || languageres == null) {
            //     var lang = 'en';
            // } else {
            //     var lang = languageres;
            // }
            const { t, i18n } = this.props;
            if (i18n.language == 'en') {
                var lang = 'en';
            } else if (i18n.language == 'de') {
                var lang = 'de';
            }
            AsyncStorage.getItem('user_token', (err, restoken) => {
                const baseUrl = b.abc();
                const userToken = JSON.parse(restoken);
                //this.setState({ isLoading: true });
                const url = `${baseUrl}/fetchsavedcard`;
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-localization': lang,
                        'Authorization': `Bearer ${userToken}`,
                    },
                })

                    .then((response) => response.json())
                    .then((res) => {
                        console.log(res, 'fetch save card');
                        if (res.cardDetail != '') {
                            this.setState({
                                checkfetchcard: true,
                                last4: res.cardDetail.last4,
                                tokenId: res.cardDetail.id,
                            });
                        } else {
                            this.setState({
                                checkfetchcard: false,
                                last4: '',
                                tokenId: '',
                            });
                        }

                    })
                    .done();
            });
        });
    }

    planDetails = async () => {
        AsyncStorage.getItem('language', (err, languageres) => {
            //console.log(languageres + "language from home screen");

            // if (languageres == '' || languageres == null) {
            //     var lang = 'en';
            // } else {
            //     var lang = languageres;
            // }
            const { t, i18n } = this.props;
            if (i18n.language == 'en') {
                var lang = 'en';
            } else if (i18n.language == 'de') {
                var lang = 'de';
            }
            AsyncStorage.getItem('user_token', (err, restoken) => {
                const baseUrl = b.abc();
                const userToken = JSON.parse(restoken);
                const plan_id = this.props.navigation.getParam('planid', 'NO-ID');
                this.setState({ isLoading: true });
                const url = `${baseUrl}/fetchPlanDetail/${plan_id}`;
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-localization': lang,
                        'Authorization': `Bearer ${userToken}`,
                    },
                })

                    .then((response) => response.json())
                    .then((res) => {
                        console.log(res.planDetail.plan_feature, 'getplanList');
                        this.setState({
                            planId: res.planDetail.plan_id,
                            planName: res.planDetail.plan_title,
                            planAmount: res.planDetail.plan_amount,
                            planType: res.planDetail.plan_schedule_type,
                            userEmail: res.planDetail.user_email,
                            planFeature: res.planDetail.plan_feature,
                            isLoading: false
                        });

                    })
                    .done();
            });
        });
    }

    finalpayment = async () => {
        if (this.state.checkfetchcard == true) {
            AsyncStorage.getItem('language', (err, languageres) => {
                //console.log(languageres + "language from home screen");

                if (languageres == '' || languageres == null) {
                    var lang = 'en';
                } else {
                    var lang = languageres;
                }
                AsyncStorage.getItem('user_token', (err, restoken) => {
                    const baseUrl = b.abc();
                    this.setState({ isLoading: true });
                    const userToken = JSON.parse(restoken);
                    const url = `${baseUrl}/purchase-plan`;
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-localization': lang,
                            'Authorization': `Bearer ${userToken}`,
                        },
                        body: JSON.stringify({
                            stripeToken: '',
                            email: '',
                            planId: this.state.planId,
                        })
                    })

                        .then((response) => response.json())
                        .then((res) => {
                            console.log(this.state.tokenId);
                            if (res.status == 200) {
                                this.setState({ isLoading: false, addmodalVisible: false, });
                                this.setState({ Msg: res.message });
                                this.showAlert();
                            } else {
                                this.setState({ isLoading: false, addmodalVisible: false, });
                                this.setState({ Msg: "Something Went Wrong!Payment Faild" });
                                this.showAlert();
                            }
                        })
                        .done();
                });
            });
        } else {
            if (this.state.cardno == '' || this.state.expdate == '' || this.state.cvc == '') {
                alert("Enter all card details");
            } else {
                const myArray = this.state.expdate.split("/");
                const cardno = this.state.cardno.replace(/ +/g, "");
                const expmonth = myArray[0];
                const expyear = myArray[1];
                const cvc = this.state.cvc;
                //console.log(cardno + '/'+ expmonth +'/'+ expyear +'/'+ cvc);

                const apiKey = 'pk_test_51J9tA6LsRntyE5tmeHzeaUHKSxe58KGENUCJoEA6W9VJ2tOSj2KieAEtaG0tiYv9DVRRqSR9Fv3lozvNo9VVHfGL00v0KcTTOQ';
                const client = new Stripe(apiKey);
                // Create a Stripe token with new card infos
                const token = await client.createToken({
                    number: cardno,
                    exp_month: expmonth,
                    exp_year: expyear,
                    cvc: cvc,
                });
                console.log(token, 'card token from stripe');
                AsyncStorage.getItem('language', (err, languageres) => {
                    //console.log(languageres + "language from home screen");

                    if (languageres == '' || languageres == null) {
                        var lang = 'en';
                    } else {
                        var lang = languageres;
                    }
                    AsyncStorage.getItem('user_token', (err, restoken) => {
                        const baseUrl = b.abc();
                        this.setState({ isLoading: true });
                        const userToken = JSON.parse(restoken);
                        const url = `${baseUrl}/purchase-plan`;
                        fetch(url, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'X-localization': lang,
                                'Authorization': `Bearer ${userToken}`,
                            },
                            body: JSON.stringify({
                                stripeToken: token.id,
                                email: this.state.userEmail,
                                planId: this.state.planId,
                            })
                        })

                            .then((response) => response.json())
                            .then((res) => {
                                console.log(res);
                                if (res.status == 200) {
                                    this.setState({ isLoading: false, addmodalVisible: false, });
                                    this.setState({ Msg: res.message });
                                    this.showAlert();
                                } else {
                                    this.setState({ isLoading: false, addmodalVisible: false, });
                                    this.setState({ Msg: "Something Went Wrong!Payment Faild" });
                                    this.showAlert();
                                }
                            })
                            .done();
                    });
                });
            }

        }

    }

    updateCard = async () => {
        if (this.state.cardnou == '' || this.state.expdateu == '' || this.state.cvcu == '') {
            alert("Enter all card details");
        } else {
            this.setState({ isLoading: true });
            const myArray = this.state.expdateu.split("/");
            const cardno = this.state.cardnou.replace(/ +/g, "");
            const expmonth = myArray[0];
            const expyear = myArray[1];
            const cvc = this.state.cvcu;

            const apiKey = 'pk_test_51J9tA6LsRntyE5tmeHzeaUHK9VJ2tOSj2KieAEtaG0tiYv9DVRRqSR9Fv3lozvNo9VVHfGL00v0KcTTOQ';
            const client = new Stripe(apiKey);
            // Create a Stripe token with new card infos
            const token = await client.createToken({
                number: cardno,
                exp_month: expmonth,
                exp_year: expyear,
                cvc: cvc,
            });

            console.log(token, 'card token from stripe');
            AsyncStorage.getItem('language', (err, languageres) => {
                //console.log(languageres + "language from home screen");

                if (languageres == '' || languageres == null) {
                    var lang = 'en';
                } else {
                    var lang = languageres;
                }
                AsyncStorage.getItem('user_token', (err, restoken) => {
                    const baseUrl = b.abc();
                    //this.setState({ isLoading: true });
                    const userToken = JSON.parse(restoken);
                    const url = `${baseUrl}/updateCardDetail`;
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'X-localization': lang,
                            'Authorization': `Bearer ${userToken}`,
                        },
                        body: JSON.stringify({
                            stripeToken: token.id,
                        })
                    })

                        .then((response) => response.json())
                        .then((res) => {
                            console.log(res);
                            if (res.status == 200) {
                                this.setState({ isLoading: false, updatemodalVisible: false, });
                                this.setState({ Msg: res.message });
                                this.showAlert();
                            } else {
                                this.setState({ isLoading: false, updatemodalVisible: false, });
                                this.setState({ Msg: "Something Went Wrong!Payment Faild" });
                                this.showAlert();
                            }
                        })
                        .done();
                });
            });
        }
    }

    handleConnectionChange = () => {
        fetch('https://www.google.com/', {
            mode: 'no-cors',
        })
            .then(() => {

            }).catch(() => {

                Alert.alert(
                    '',
                    'No Internet Connection',
                    [

                        {
                            text: 'OK', onPress: () => {
                                RNExitApp.exitApp();
                            }
                        },
                    ],
                    { cancelable: false },
                )

                //
            })
    }

    renderFeatureList = ({ item, index }) => {
        let themeValue = this.context;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingRight: 10, marginRight: 10 }}>
                <FontAwesomeIcon name="check" size={30} color="#ff6e4f" />
                <Text style={(themeValue == 'light') ? styles.featureText : styles.featureTextDark}>{item.feature_title}</Text>
            </View>
        )
    }

    handleCardNumber = (text) => {
        let formattedText = text.split(' ').join('');
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        this.setState({ cardno: formattedText });
        return formattedText;
    }
    handleCardNumberu = (text) => {
        let formattedText = text.split(' ').join('');
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        this.setState({ cardnou: formattedText });
        return formattedText;
    }

    handleExpDate = (text) => {
        let formattedText = text.split('/').join('');
        console.log(formattedText.length);
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,2}', 'g')).join('/');
        }
        this.setState({ expdate: formattedText });
        return formattedText;
    }
    handleExpDateu = (text) => {
        let formattedText = text.split('/').join('');
        console.log(formattedText.length);
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,2}', 'g')).join('/');
        }
        this.setState({ expdateu: formattedText });
        return formattedText;
    }

    showAlert = () => {
        this.setState({
            showAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showAlert: false
        });
    };


    render() {
        const { showAlert } = this.state;
        const { Msg } = this.state;
        let themeValue = this.context;
        return (
            <MyLangContext.Consumer>
                {langvalue => (
                    <View style={(themeValue == 'light') ? styles.container : styles.containerDark}>
                        <StatusBar backgroundColor="#7c7c7c" />
                        {/* custome header section start */}
                        <View style={styles.ProfileSettingcontainer}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <View style={styles.backbutton}>
                                    <View style={{ marginLeft: 10 }}>
                                        <FontAwesomeIcon name="angle-left" size={40} color={(themeValue == 'light') ? '#000' : '#fff'} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.settingicon}>

                            </View>

                        </View>
                        {/* custome header section end */}
                        <ScrollView>

                            <View style={{ margin: 25, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={(themeValue == 'light') ? styles.headerTitle : styles.headerTitleDark}>{t('plan_details')}</Text>
                                    <FontAwesomeIcon name="angle-right" size={20} color="#ff6e4f" />
                                </View>
                                <Text style={{ color: '#7c7c7c', fontSize: responsiveFontSize(3), fontWeight: 'normal', fontFamily: 'MaisonNeue Book' }}>{t('we_are_happy_to')}</Text>
                            </View>
                            {this.state.checkfetchcard == true ?
                                <View style={{ margin: 25, }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#7c7c7c', fontSize: responsiveFontSize(3), fontWeight: 'normal', fontFamily: 'MaisonNeue Book' }}>{t('active_card_details')}</Text>
                                        <Button
                                            title={t('update')}
                                            onPress={() => this.setState({ updatemodalVisible: true })}
                                            color={'#ff6e51'}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', borderColor: 'black', borderWidth: 1, marginTop: 5 }}>
                                        <Image
                                            source={IMAGE.ICON_CARD}
                                            resizeMode='contain'
                                            style={{ width: 85, height: 85 }}
                                        />
                                        <Text>xxxx-xxxx-xxxx-{this.state.last4}</Text>
                                    </View>
                                </View>
                                :
                                <View></View>
                            }
                            <View style={{ marginLeft: 25, marginRight: 25, marginTop: 10 }}>
                                <View style={{ backgroundColor: '#ff6e51', height: responsiveHeight(7), width: responsiveWidth(85), borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ alignItems: "flex-start", marginLeft: 20 }}>
                                        <Text style={{ color: '#ffffff', fontFamily: 'MaisonNeue Medium' }}>{this.state.planName}</Text>
                                    </View>
                                    <View style={{ alignItems: "flex-end", marginRight: 20 }}>
                                        <Text style={{ color: '#ffffff', fontFamily: 'MaisonNeue Medium' }}>€{this.state.planAmount}/{this.state.planType}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginLeft: 25, marginTop: 20, padding: 5, width: responsiveWidth(88) }}>

                                <FlatList
                                    data={this.state.planFeature}
                                    renderItem={this.renderFeatureList}
                                    keyExtractor={(item, index) => index}
                                    removeClippedSubviews={true}
                                    maxToRenderPerBatch={60}
                                />

                            </View>
                            {this.state.checkfetchcard == true ?
                                <TouchableOpacity onPress={() => this.finalpayment()}>
                                    <View style={{ marginLeft: 25, marginRight: 25, marginTop: 20, marginBottom: 20 }}>
                                        <View style={{ backgroundColor: '#ff6e51', height: responsiveHeight(7), width: responsiveWidth(85), borderRadius: 25, paddingVertical: 15 }}>
                                            <Text style={{ color: '#fffeff', fontSize: responsiveFontSize(2), textAlign: 'center', fontFamily: 'MaisonNeue Medium' }}>{t('continue')}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.setState({ addmodalVisible: true })}>
                                    <View style={{ marginLeft: 25, marginRight: 25, marginTop: 20, marginBottom: 20 }}>
                                        <View style={{ backgroundColor: '#ff6e51', height: responsiveHeight(7), width: responsiveWidth(85), borderRadius: 25, paddingVertical: 15 }}>
                                            <Text style={{ color: '#fffeff', fontSize: responsiveFontSize(2), textAlign: 'center', fontFamily: 'MaisonNeue Medium' }}>{t('continue')}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        </ScrollView>
                        <AnimatedLoader
                            visible={this.state.isLoading}
                            overlayColor="rgba(255,255,255,1)"
                            animationStyle={styles.lottie}
                            source={require("../../../../loader.json")}
                            speed={1}
                        />
                        <AwesomeAlert
                            show={showAlert}
                            showProgress={false}
                            title=""
                            messageStyle={{ fontSize: responsiveFontSize(2) }}
                            message={Msg}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            cancelText="OK"
                            cancelButtonColor="#ff6e51"
                            onCancelPressed={() => {
                                this.hideAlert();
                            }}
                            onConfirmPressed={() => {
                                this.hideAlert();
                            }}
                        />
                        {/* ------------------------addlist Modal Start----------------- */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.addmodalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                this.setState({ addmodalVisible: false })
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={{
                                        position: 'absolute', height: 30, width: 30,
                                        borderRadius: 15, backgroundColor: 'rgba(255, 255, 255,0.8)', right: 15, top: 20, alignItems: 'center', justifyContent: 'center', zIndex: 2000
                                    }}>
                                        <Pressable onPress={() => {
                                            this.setState({ addmodalVisible: false });
                                        }}>
                                            <Image
                                                source={IMAGE.ICON_CLOSE}
                                                resizeMode='contain'
                                                style={{ width: 25, height: 25, marginLeft: 10, marginRight: 10 }}
                                            />
                                        </Pressable>
                                    </View>
                                    <View style={{ height: responsiveHeight(40), width: responsiveWidth(78) }}>
                                        <ScrollView>
                                            <View style={{ margin: 25, }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ color: '#212121', fontSize: responsiveFontSize(4), fontWeight: 'bold', marginRight: 10, fontFamily: 'MaisonNeue Demi' }}>{t('card_payment')}</Text>

                                                </View>
                                                <Text style={{ color: '#9c9c9c', fontSize: responsiveFontSize(3), fontWeight: 'normal', fontFamily: 'MaisonNeue Book' }}>{t('enter_card_details')}</Text>
                                            </View>
                                            <View style={{ marginLeft: 25, marginRight: 25, marginBottom: 10 }}>
                                                <View style={{ backgroundColor: '#dedede', height: responsiveHeight(6), width: responsiveWidth(65), borderRadius: 25 }}>
                                                    <TextInput
                                                        style={{ marginLeft: 10 }}
                                                        placeholder={t('enter_card_no')}
                                                        placeholderTextColor="#7C7C7C"
                                                        value={this.state.cardno}
                                                        //onChangeText={(cardno) => { this.setState({ cardno }) }}
                                                        onChangeText={(cardno) => this.handleCardNumber(cardno)}
                                                        underlineColorAndroid="transparent"
                                                        maxLength={19}
                                                    />
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                    <View style={{ backgroundColor: '#dedede', height: responsiveHeight(6), width: responsiveWidth(32), borderRadius: 25 }}>
                                                        <TextInput
                                                            style={{ marginLeft: 10 }}
                                                            placeholder="MM/YY"
                                                            placeholderTextColor="#7C7C7C"
                                                            value={this.state.expdate}
                                                            //onChangeText={(expdate) => { this.setState({ expdate }) }}
                                                            onChangeText={(expdate) => this.handleExpDate(expdate)}
                                                            underlineColorAndroid="transparent"
                                                            maxLength={5}
                                                        />
                                                    </View>
                                                    <View style={{ backgroundColor: '#dedede', height: responsiveHeight(6), width: responsiveWidth(32), borderRadius: 25 }}>
                                                        <TextInput
                                                            style={{ marginLeft: 10 }}
                                                            placeholder="CVC"
                                                            placeholderTextColor="#7C7C7C"
                                                            value={this.state.cvc}
                                                            onChangeText={(cvc) => { this.setState({ cvc }) }}
                                                            underlineColorAndroid="transparent"
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ marginLeft: 25, marginRight: 25, marginTop: 20, marginBottom: 20, flexDirection: 'row' }}>
                                                <Pressable onPress={() => {
                                                    this.finalpayment();
                                                }}>
                                                    <View style={{ backgroundColor: '#34dc53', height: responsiveHeight(6), width: responsiveWidth(30), borderRadius: 25, paddingVertical: 15, marginRight: 15 }}>
                                                        <Text style={{ color: '#fffeff', fontSize: responsiveFontSize(2), textAlign: 'center', fontFamily: 'MaisonNeue Medium' }}>{t('add')}</Text>
                                                    </View>
                                                </Pressable>
                                                <Pressable onPress={() => {
                                                    this.setState({ addmodalVisible: false });
                                                }}>
                                                    <View style={{ backgroundColor: '#868686', height: responsiveHeight(6), width: responsiveWidth(30), borderRadius: 25, paddingVertical: 15 }}>
                                                        <Text style={{ color: '#fffeff', fontSize: responsiveFontSize(2), textAlign: 'center', fontFamily: 'MaisonNeue Medium' }}>{t('cancel')}</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        {/* ------------------------addlist Modal end----------------- */}
                        {/* ------------------------update card Modal Start----------------- */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.updatemodalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                this.setState({ updatemodalVisible: false })
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <View style={{
                                        position: 'absolute', height: 30, width: 30,
                                        borderRadius: 15, backgroundColor: 'rgba(255, 255, 255,0.8)', right: 15, top: 20, alignItems: 'center', justifyContent: 'center', zIndex: 2000
                                    }}>
                                        <Pressable onPress={() => {
                                            this.setState({ updatemodalVisible: false });
                                        }}>
                                            <Image
                                                source={IMAGE.ICON_CLOSE}
                                                resizeMode='contain'
                                                style={{ width: 25, height: 25, marginLeft: 10, marginRight: 10 }}
                                            />
                                        </Pressable>
                                    </View>
                                    <View style={{ height: responsiveHeight(40), width: responsiveWidth(78) }}>
                                        <ScrollView>
                                            <View style={{ margin: 25, }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ color: '#212121', fontSize: responsiveFontSize(4), fontWeight: 'bold', marginRight: 10, fontFamily: 'MaisonNeue Demi' }}>{t('update_card')}</Text>

                                                </View>
                                                <Text style={{ color: '#9c9c9c', fontSize: responsiveFontSize(3), fontWeight: 'normal', fontFamily: 'MaisonNeue Book' }}>{t('enter_card_details')}</Text>
                                            </View>
                                            <View style={{ marginLeft: 25, marginRight: 25, marginBottom: 10 }}>
                                                <View style={{ backgroundColor: '#dedede', height: responsiveHeight(6), width: responsiveWidth(65), borderRadius: 25 }}>
                                                    <TextInput
                                                        style={{ marginLeft: 10 }}
                                                        placeholder={t('enter_card_no')}
                                                        placeholderTextColor="#7C7C7C"
                                                        value={this.state.cardnou}
                                                        //onChangeText={(cardno) => { this.setState({ cardno }) }}
                                                        onChangeText={(cardnou) => this.handleCardNumberu(cardnou)}
                                                        underlineColorAndroid="transparent"
                                                        maxLength={19}
                                                    />
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                    <View style={{ backgroundColor: '#dedede', height: responsiveHeight(6), width: responsiveWidth(32), borderRadius: 25 }}>
                                                        <TextInput
                                                            style={{ marginLeft: 10 }}
                                                            placeholder="MM/YY"
                                                            placeholderTextColor="#7C7C7C"
                                                            value={this.state.expdateu}
                                                            //onChangeText={(expdate) => { this.setState({ expdate }) }}
                                                            onChangeText={(expdateu) => this.handleExpDateu(expdateu)}
                                                            underlineColorAndroid="transparent"
                                                            maxLength={5}
                                                        />
                                                    </View>
                                                    <View style={{ backgroundColor: '#dedede', height: responsiveHeight(6), width: responsiveWidth(32), borderRadius: 25 }}>
                                                        <TextInput
                                                            style={{ marginLeft: 10 }}
                                                            placeholder="CVC"
                                                            placeholderTextColor="#7C7C7C"
                                                            value={this.state.cvcu}
                                                            onChangeText={(cvcu) => { this.setState({ cvcu }) }}
                                                            underlineColorAndroid="transparent"
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{ marginLeft: 25, marginRight: 25, marginTop: 20, marginBottom: 20, flexDirection: 'row' }}>
                                                <Pressable onPress={() => {
                                                    this.updateCard();
                                                }}>
                                                    <View style={{ backgroundColor: '#34dc53', height: responsiveHeight(6), width: responsiveWidth(30), borderRadius: 25, paddingVertical: 15, marginRight: 15 }}>
                                                        <Text style={{ color: '#fffeff', fontSize: responsiveFontSize(2), textAlign: 'center', fontFamily: 'MaisonNeue Medium' }}>{t('update')}</Text>
                                                    </View>
                                                </Pressable>
                                                <Pressable onPress={() => {
                                                    this.setState({ updatemodalVisible: false });
                                                }}>
                                                    <View style={{ backgroundColor: '#868686', height: responsiveHeight(6), width: responsiveWidth(30), borderRadius: 25, paddingVertical: 15 }}>
                                                        <Text style={{ color: '#fffeff', fontSize: responsiveFontSize(2), textAlign: 'center', fontFamily: 'MaisonNeue Medium' }}>{t('cancel')}</Text>
                                                    </View>
                                                </Pressable>
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        {/* ------------------------update card Modal end----------------- */}
                    </View>
                )}
            </MyLangContext.Consumer>
        );
    }
}
Payment.contextType = MyThemeContext;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eaeaea',
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerTitle: {
        color: '#212121',
        fontSize: responsiveFontSize(4),
        fontWeight: 'bold',
        marginRight: 10,
        fontFamily: 'MaisonNeue Demi'
    },
    headerTitleDark: {
        color: '#e8e8e8',
        fontSize: responsiveFontSize(4),
        fontWeight: 'bold',
        marginRight: 10,
        fontFamily: 'MaisonNeue Demi'
    },
    headerTitle2: {
        color: '#212121',
        fontSize: responsiveFontSize(3.8),
        fontWeight: '900',
        marginRight: 10,
        fontFamily: 'MaisonNeue Medium'
    },
    headerTitle2Dark: {
        color: '#e8e8e8',
        fontSize: responsiveFontSize(3.8),
        fontWeight: '900',
        marginRight: 10,
        fontFamily: 'MaisonNeue Medium'
    },
    featureText: {
        color: '#212121',
        fontSize: responsiveFontSize(2.5),
        marginLeft: 15,
        fontFamily: 'MaisonNeue Book'
    },
    featureTextDark: {
        color: '#e8e8e8',
        fontSize: responsiveFontSize(2.5),
        marginLeft: 15,
        fontFamily: 'MaisonNeue Book'
    },
    ProfileSettingcontainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        justifyContent: 'space-between'
    },
    settingicon: {
        alignItems: "flex-end",
    },
    backbutton: {
        alignItems: "flex-start"
    },
    slide: {
        width: itemWidth,
        height: itemHeight,
        paddingHorizontal: horizontalMargin
        // other styles for the item container
    },
    slideInnerContainer: {
        width: slideWidth,
        flex: 1
        // other styles for the inner container
    },
    lottie: {
        width: 100,
        height: 100
    },
    //modal 
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 50,
        padding: 15,
        shadowColor: "#dedede",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalViewDark: {
        margin: 10,
        backgroundColor: "#202020",
        borderRadius: 50,
        padding: 15,
        shadowColor: "#dedede",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

});

export default withTranslation()(Payment);
