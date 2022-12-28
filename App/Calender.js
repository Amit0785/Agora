import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, BackHandler, AsyncStorage, FlatList, ScrollView, Animated, ImageBackground, Alert, RefreshControl, TouchableWithoutFeedback, StatusBar, CheckBox, TextInput, Modal, Pressable, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Container, Header, Item, Input, Icon, Button, Text, List, ListItem, Body, Left, Right, Thumbnail, Tab, Tabs, Badge } from 'native-base';
import { responsiveHeight, responsiveWidth, responsiveFontSize, } from 'react-native-responsive-dimensions';
import { RFValue } from "react-native-responsive-fontsize";
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { composeInitialProps, withTranslation } from "react-i18next";
import { IMAGE } from '../../../constants/Image';
import moment from 'moment';
import { Base_Url } from '../../../Services/Constant';
import { connect } from 'react-redux';
import AnimatedLoader from 'react-native-animated-loader';
const { width, height } = Dimensions.get('window');
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 180.5;
const horizontalMargin = 5;
const slideWidth = 300;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 0.5;
const itemHeight = 200;

LocaleConfig.locales['en'] = {
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep.', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};
LocaleConfig.defaultLocale = 'en';

class MyBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: '',
            slider: [],
            isLoading: false,
            isSelected1: false,
            isSelected2: false,
            value: 0,
            modalVisible: false,
            modalVisible2: false,
            selectedDate: "",
            markedDates: {},
            dateData: [],
            dateText: [],
            eventData: [],
            cancelId: '',
            cancelReson: ""
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getSelectedDateHandler();
        });
        setTimeout(() => this._scrollView.getScrollResponder().scrollTo({ x: 450, y: 0, animated: true }), 0);
    }

    componentWillUnmount() {
        this.focusListener.remove()
    }

    onChangeTextValue = (value) => {
        this.setState({ cancelReson: value });
    }

    formatTime(timeString) {
        const [hourString, minute] = timeString.split(":");
        const hour = +hourString % 24;
        return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
    }

    formatTimes(timeString) {
        const [hourString, minute] = timeString.split(":");
        const hour = +hourString % 24;
        return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
    }

    convertDate(d) {
        var parts = d.split("-");
        var months = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };
        var store = parts[0] + " " + months[parts[1]] + " " + parts[2]
        return store;
    }

    onCancelHandler(value) {
        this.setState({
            modalVisible: false,
            cancelId: value,
            modalVisible2: true
        });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible2: visible });
    }


    getSelectedDateHandler = () => {
        this.setState({ isLoading: true });
        var axios = require('axios');
        var Token = this.props.token;
        var config = {
            method: 'get',
            url: `${Base_Url}/ordersForUser`,
            headers: {
                'token': Token
            }
        };

        axios(config)
            .then(async response => {

                if (response.data.statusCode == '200') {
                    this.setState({ isLoading: false });
                    var arr = (response.data.data)
                    var copyItems = [];
                    var restaurantsName = [];
                    arr.forEach((item) => {
                        (item?.table_details[0] && item?.table_details[0]?.tableDetails && item?.table_details[0]?.tableDetails?.bookingTimingsDetails[0]) ? copyItems.push(item?.table_details[0]?.tableDetails?.bookingTimingsDetails[0]?.from_date_time?.substring(0, 10)) : null;

                        (item?.table_details[0] && item?.table_details[0]?.tableDetails && item?.table_details[0]?.tableDetails?.bookingTimingsDetails[0]) ? restaurantsName.push({ date: item?.table_details[0]?.tableDetails?.bookingTimingsDetails[0]?.from_date_time?.substring(0, 10), name: item?.restaurant?.restaurant_name, id: item.id }) : null;

                    });

                    this.setState({
                        dateData: copyItems,
                        dateText: restaurantsName
                    })
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
            });

    }

    cancelSubmit = () => {
        this.setState({ modalVisible2: false });
        var Token = this.props.token;
        this.setState({ isLoading: true })
        var myHeaders = new Headers();
        myHeaders.append("Token", Token);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "status": 2,
            "order_id": this.state.cancelId,
            "reject_reason": this.state.cancelReson
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${Base_Url}/update-order-status`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.statusCode == '200') {
                    this.setState({ isLoading: false })
                    this.getSelectedDateHandler()
                } else {
                    this.setState({ isLoading: false })
                }
            })
            .catch(error => {
                this.setState({ isLoading: false })
                console.log('error', error)
            });

    }



    getSelectedDayEvents = (date) => {
        this.setState({ isLoading: true });
        var Token = this.props.token;
        var axios = require('axios');
        var data = JSON.stringify({
            "date": date
        });

        var config = {
            method: 'get',
            url: `${Base_Url}/ordersForUser`,
            headers: {
                'Token': Token,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(async response => {
                if (response.data.statusCode == '200') {
                    this.setState({
                        isLoading: false,
                        eventData: response.data.data,
                        modalVisible: true
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false });
            });


    };


    render() {
        const { t, i18n } = this.props;
        return (
            <View style={styles.container}>

                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.ProfileSettingcontainer}>
                    <View style={styles.backbutton}>
                        <TouchableOpacity style={styles.mapIconView} onPress={() => this.props.navigation.goBack(null)}>
                            <Image source={IMAGE.ICON_ARROW} style={styles.mapIcon} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 5, justifyContent: "center" }}>
                        <Text style={{ fontSize: RFValue(18), color: '#2B2B2B', fontWeight: '600', fontFamily: "OpenSans-SemiBold" }}>{t('MyBooking')}</Text>
                    </View>
                    <View style={styles.settingicon}>
                        <TouchableOpacity style={styles.drawerIconTouch} onPress={() => this.props.navigation.openDrawer()}>
                            <Image source={require('../../../image/ellipsis-h.png')} style={styles.drawerIcon} />
                        </TouchableOpacity>
                    </View>
                </View>


                <ScrollView showsVerticalScrollIndicator={false} >

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} ref={(view) => this._scrollView = view}>
                        <View style={{ flexDirection: 'row', margin: 10 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Account')}>
                                <View style={styles.inactiveMenuView}>
                                    <Image
                                        source={IMAGE.ICON_ACCOUNT_MENU}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(4), height: responsiveHeight(4), }}
                                    />
                                    <Text style={styles.inactiveMenuText}>{t('MyAccount')} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Address')}>
                                <View style={styles.inactiveMenuView}>
                                    <Image
                                        source={IMAGE.ICON_MAP}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(4), height: responsiveHeight(4) }}
                                    />
                                    <Text style={styles.inactiveMenuText}>{t('SaveAddress')} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Card')}>
                                <View style={styles.inactiveMenuView}>
                                    <Image
                                        source={IMAGE.ICON_CREDIT_CARD}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(4), height: responsiveHeight(4) }}
                                    />
                                    <Text style={styles.inactiveMenuText}>{t('SaveCreditCard')} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderMeal')}>
                                <View style={styles.inactiveMenuView}>
                                    <Image
                                        source={IMAGE.ICON_ORDER_LIST}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(4), height: responsiveHeight(4) }}
                                    />
                                    <Text style={styles.inactiveMenuText}>{t('OrderMeal')} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyBooking')}>
                                <View style={styles.activeMenuView}>
                                    <Image
                                        source={IMAGE.ICON_BOOKING}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(4), height: responsiveHeight(4) }}
                                    />
                                    <Text style={styles.activeMenuText}>{t('MyBooking')} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('MyFavResturant')}>
                                <View style={styles.inactiveMenuView}>
                                    <Image
                                        source={IMAGE.ICON_FAVOURITE}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(4), height: responsiveHeight(4) }}
                                    />
                                    <Text style={styles.inactiveMenuText}>{t('MyFavouriteRestaurant')} </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
                                <View style={styles.inactiveMenuView}>
                                    <Image
                                        source={IMAGE.ICON_LOCK}
                                        resizeMode='contain'
                                        style={{ width: responsiveWidth(3), height: responsiveHeight(3) }}
                                    />
                                    <Text style={styles.inactiveMenuText}>{t('ChangePassword')} </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>


                    <Calendar
                        theme={{
                            'stylesheet.calendar.main': {
                                monthView: {
                                    backgroundColor: '#FFFFFF',
                                },
                                week: {
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    margin: 1,
                                    padding: 2,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#CFCFCF',
                                    borderRadius: 5,
                                }
                            },
                            'stylesheet.calendar.header': {
                                header: {
                                    flexDirection: 'row',
                                    alignSelf: "center",
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                },
                                monthText: {
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                    fontSize: RFValue(15),
                                    fontWeight: "600",
                                    fontFamily: "OpenSans-SemiBold",
                                },
                                week: {
                                    paddingVertical: 7,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',

                                }
                            },
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#000000',
                            textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#797979',
                            textDisabledColor: '#CCCCCC',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#2F3237',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: '#2F3237',
                            indicatorColor: '#000000',
                            textDayFontFamily: 'OpenSans-SemiBold',
                            textMonthFontFamily: 'OpenSans-SemiBold',
                            textDayHeaderFontFamily: 'OpenSans-SemiBold',
                            textDayFontWeight: '600',
                            textMonthFontWeight: '600',
                            textDayHeaderFontWeight: 'bold',
                            textDayFontSize: RFValue(12),
                            textMonthFontSize: RFValue(15),
                            textDayHeaderFontSize: RFValue(12)
                        }}

                        calendarData={'Hello'}
                        hideExtraDays={true}
                        dayComponent={({ date, state }) => {
                            let testData = date.dateString.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1");
                            let testEvent = this.state.dateText.filter(i => testData.includes(i.date));
                            return (

                                <View>

                                    {this.state.dateData.includes(date.dateString.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1")) ?
                                        <TouchableOpacity style={{ height: height / 12, width: width / 6.5, backgroundColor: "#E4E4E4", alignItems: "center", borderRadius: 5, justifyContent: "space-between" }} onPress={() => this.getSelectedDayEvents(date.dateString)}>

                                            <Text style={{ color: "#2F3237" }}>{date.day}</Text>
                                            <ScrollView horizontal={true} style={{ borderRadius: 5, backgroundColor: "#2F3237", width: '90%', marginTop: 20, marginBottom: 1.5 }}>
                                                {testEvent ? testEvent.map((item, index) => (
                                                    <View key={index} style={{ height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                                        <Text style={{ color: "#EBE1D7", fontSize: RFValue(8) }} >{item.name}</Text>
                                                    </View>
                                                )) : null
                                                }

                                            </ScrollView>
                                        </TouchableOpacity>
                                        :
                                        <View style={{ height: height / 12, width: width / 6.5, alignItems: "center" }}>
                                            <Text style={{ color: "#797979" }}>{date.day}</Text>
                                        </View>
                                    }

                                </View>
                            );
                        }}
                    />


                </ScrollView>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false })
                    }}
                >
                    <View style={styles.centeredView}>
                        <StatusBar backgroundColor="#rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={styles.modalView}>

                            <View style={{ height: height / 15, width: '100%', flexDirection: "row" }}>
                                <View style={{ height: "100%", width: "75%", justifyContent: "center" }}>
                                    <Text style={{ fontFamily: "OpenSans-Bold", fontSize: RFValue(22), fontWeight: '400', color: "#303030" }}>
                                        Booking Details
                                    </Text>
                                </View>
                                <View style={{ height: "100%", width: "25%", justifyContent: "center", alignItems: "flex-end", marginHorizontal: 5 }}>
                                    <TouchableOpacity style={{ height: '90%', width: "55%", backgroundColor: "#FFFFFF", borderRadius: 10, elevation: 5, alignItems: "center", justifyContent: "center" }}>
                                        <FontAwesomeIcon name="times" size={30} color="#A9A9A9" onPress={() => this.setState({ modalVisible: false })} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView>
                                {
                                    this.state.eventData ? this.state.eventData.map((data, index) => (
                                        <View key={index}>
                                            <View style={{ height: height / 7, width: width / 1.05, paddingVertical: 10, marginVertical: 5, borderBottomColor: "#CFCFCF", borderBottomWidth: 1.5, flexDirection: "row", justifyContent: "space-between" }}>
                                                <View style={{ height: "100%", width: "30%" }}>
                                                    <Image source={{ uri: data.restaurant.restaurant_images[0].images }} style={{ height: "100%", width: "100%", resizeMode: "cover", borderRadius: 10 }} />
                                                </View>

                                                <View style={{ height: "100%", width: "70%", flexDirection: "column" }}>
                                                    <View style={{ height: "33.3%", width: "100%", paddingHorizontal: 10 }}>
                                                        <Text style={{ fontFamily: "OpenSans-SemiBold", fontWeight: '700', fontSize: RFValue(17), color: "#303030" }}>
                                                            {data.restaurant.restaurant_name}
                                                        </Text>
                                                    </View>
                                                    <View style={{ height: "33.3%", width: "85%", paddingHorizontal: 10 }}>
                                                        <Text numberOfLines={1} style={{ fontFamily: "OpenSans-Medium", fontWeight: '400', fontSize: RFValue(14), color: "#303030" }}>
                                                            {data.restaurant.address}
                                                        </Text>
                                                    </View>
                                                    <View style={{ height: "33.3%", width: "100%", paddingHorizontal: 10 }}>
                                                        <View style={{ height: "100%", width: "70%", borderRadius: 5, backgroundColor: "#EBE1D7", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                            <Text numberOfLines={1} style={{ fontFamily: "OpenSans-Medium", fontWeight: '400', fontSize: RFValue(14), color: "#303030" }}>
                                                                Status:
                                                            </Text>
                                                            <Text numberOfLines={1} style={{ fontFamily: "OpenSans-SemiBold", fontWeight: '600', fontSize: RFValue(14), color: "#303030" }}>
                                                                {data.order_acceptance === 0 ? "Pending" : "Confirm"}
                                                            </Text>
                                                        </View>

                                                    </View>

                                                </View>
                                            </View>

                                            <View style={{ height: height / 25, width: width / 1.05, justifyContent: "center", alignItems: "flex-start" }}>
                                                <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                    ITEMS
                                                </Text>
                                            </View>

                                            {data.food_items ? data.food_items.map((datas, key) => (
                                                <View key={key} style={{ width: width / 1.05, flexDirection: "row" }}>
                                                    <View style={{ width: "40%", justifyContent: "center", alignItems: "flex-start" }}>
                                                        <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                            {datas.menu_name.en}
                                                        </Text>
                                                    </View>

                                                    <View style={{ width: "40%", justifyContent: "center", alignItems: "flex-end" }}>
                                                        <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                            KD {datas.menu_price}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )) : null
                                            }


                                            <View style={{ height: height / 14, width: width / 1.05, paddingBottom: 10, marginVertical: 5, borderBottomColor: "#CFCFCF", borderBottomWidth: 1.5, }}>
                                                <View style={{ height: "100%", width: "100%", flexDirection: "column" }}>
                                                    <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                        <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                            ORDERD ON
                                                        </Text>
                                                    </View>
                                                    <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                        <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                            {moment(data.created_at).format('DD MMM YYYY')} at {this.formatTime(data.created_at.substring(11, 19))}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            {data.table_details ? data.table_details.map((detiles, keys) => (

                                                <View key={keys} style={{ height: height / 4, width: width / 1.05, paddingVertical: 10, marginVertical: 5, borderBottomColor: "#CFCFCF", borderBottomWidth: 1.5, flexDirection: "column" }}>

                                                    <View style={{ height: "25%", width: "100%", flexDirection: "column" }}>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                                Order Number
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                                {data.order_no}
                                                            </Text>
                                                        </View>

                                                    </View>

                                                    <View style={{ height: "25%", width: "100%" }}>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                                Table Number
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                                {detiles.tableDetails.table_number}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <View style={{ height: "25%", width: "100%" }}>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                                Table Booking Date and Time
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                                {this.convertDate(detiles.tableDetails.bookingTimingsDetails[0].from_date_time.substring(0, 10))} at {this.formatTimes(detiles.tableDetails.bookingTimingsDetails[0].from_date_time.substring(11, 16))} - {this.formatTimes(detiles.tableDetails.bookingTimingsDetails[0].to_date_time.substring(11, 16))}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <View style={{ height: "25%", width: "100%" }}>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                                Number of guest
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                                {detiles.tableDetails.no_of_seats} Member
                                                            </Text>
                                                        </View>
                                                    </View>

                                                </View>
                                            )) : null
                                            }

                                            {data.food_items ? data.food_items.map((detiless, keys) => (
                                                <View key={keys} style={{ height: height / 10, width: width / 1.05, paddingBottom: 10, marginVertical: 5, flexDirection: "column" }}>
                                                    <View style={{ height: "100%", width: "90%" }}>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text style={{ fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600", color: "#888888" }}>
                                                                Special Requests
                                                            </Text>
                                                        </View>
                                                        <View style={{ height: "50%", width: "100%", justifyContent: "center" }}>
                                                            <Text numberOfLines={2} style={{ fontFamily: "OpenSans-SemiBold", fontSize: RFValue(12), fontWeight: "600", color: "#3F3F3F" }}>
                                                                {detiless.special_request}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            )) : null
                                            }
                                            <TouchableOpacity style={{ height: height / 15, width: "85%", paddingVertical: 10, marginVertical: 5, backgroundColor: "#2F3237", flexDirection: "column", borderRadius: 5, justifyContent: "center", alignItems: "center" }} onPress={() => this.onCancelHandler(data.id)}>
                                                <Text style={{ color: "#ffffff", fontFamily: "OpenSans-Medium", fontSize: RFValue(12), fontWeight: "600" }}>
                                                    Cancel Booking
                                                </Text>
                                            </TouchableOpacity>

                                        </View>
                                    )) : null
                                }
                            </ScrollView>
                        </View>
                    </View >
                </Modal >



                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible2}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible2);
                    }}
                >
                    <View style={styles.centeredView}>
                        <StatusBar backgroundColor="#rgba(0,0,0,0.7)" barStyle="light-content" />
                        <View style={styles.modalView}>
                            <TextInput
                                style={{ height: height / 5, width: width / 1.8, borderColor: "#6B6B6B", borderWidth: 1, borderRadius: 10, fontFamily: "OpenSans-SemiBold", fontWeight: "700", fontSize: RFValue(15), color: "#000000" }}
                                onChangeText={(value) => this.onChangeTextValue(value)}
                                placeholder="Reason"
                                placeholderTextColor={'#6B6B6B'}
                                textAlign={'center'}
                                multiline={true}
                            />

                            <TouchableOpacity style={{ height: height / 15, width: width / 1.9, alignSelf: "center", backgroundColor: "#000000", alignItems: "center", justifyContent: "center", borderRadius: 5, margin: 10 }} onPress={() => this.cancelSubmit()}>
                                <Text style={{ fontFamily: "OpenSans-Regular", fontSize: RFValue(12), fontWeight: "400", color: "#FFFFFF" }}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



                <AnimatedLoader
                    visible={this.state.isLoading}
                    overlayColor="rgba(255,255,255,1)"
                    source={require("../../../../cateringfork-knife.json")}
                    animationStyle={styles.lottie}
                    speed={2}
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mapIconView: {
        height: height / 20,
        width: width / 10,
        backgroundColor: '#E4E4E4',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapIcon: {
        resizeMode: "contain",
        height: "50%",
        width: "50%"
    },
    drawerIconTouch: {
        height: height / 20,
        width: width / 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.8,
        elevation: 4
    },
    drawerIcon: {
        resizeMode: "contain",
        height: "50%",
        width: "50%"
    },
    div2: {
        backgroundColor: '#fff',
        alignItems: 'center',
        width: BannerWidth,
    },
    div2Text: {
        margin: 10,
        fontSize: responsiveFontSize(1.5),
    },
    div3_active: {
        backgroundColor: '#EBE1D7',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        // marginTop: 10,
        borderRadius: 5,
        flexDirection: 'row',
        width: responsiveWidth(25),
        height: responsiveHeight(12),
        justifyContent: 'center'
    },
    div3: {
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        // marginTop: 10,
        borderRadius: 5,
        flexDirection: 'row',
        width: responsiveWidth(25),
        height: responsiveHeight(12),
        justifyContent: 'center'
    },
    div3image: {
        height: 40,
        width: 40,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
        overflow: 'hidden',
    },
    div3image_new: {
        height: responsiveHeight(15),
        width: responsiveWidth(30),
        //borderRadius: 63,
        borderWidth: 0.5,
        borderColor: '#fff',
        marginLeft: 10,
        // marginRight: 10,
        marginTop: 8,
        overflow: 'hidden',
        backgroundColor: 'white',

    },
    div4: {
        flexDirection: 'row',
        marginRight: 10,
    },

    GalleryBox: {
        //margin: 10,
        backgroundColor: '#F2F2F2',
        borderRadius: 3,
        height: responsiveHeight(25),
        width: responsiveWidth(44.5),

    },
    GalleryImg: {
        //marginTop: 1,
        borderRadius: 3,

        borderColor: '#f8668b',
    },
    SingelImgBanner: {
        backgroundColor: '#F2F2F2',
        marginTop: 20,
        borderColor: '#F2F2F2',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        width: BannerWidth - 20,
        height: BannerHeight,
        borderRadius: 15,
    },
    SingelImg: {
        height: responsiveHeight(15),
        width: responsiveWidth(44.5),
        resizeMode: 'cover',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    GalleryText: {
        // height: responsiveHeight(3),
        width: responsiveWidth(32),
        fontSize: responsiveFontSize(2),
        //textAlign: 'center',
    },
    GallerydescText: {
        //height: responsiveHeight(3),
        width: responsiveWidth(30),
        fontSize: responsiveFontSize(1.5),

        //textAlign: 'center',
    },
    amount: {
        //borderColor: 'red',
        height: responsiveHeight(3.5),
        // borderWidth: .5,
        borderRadius: 3,
        // alignItems: 'center',
        //justifyContent: 'center',
        //marginTop: 15,
        paddingLeft: 5,
        paddingRight: 5
    },
    quoteBox: {
        marginLeft: 10,
        marginRight: 5,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 3,
        height: responsiveHeight(32),
        width: responsiveWidth(95),
    },
    quotename: {
        color: 'gray',
        marginTop: 20,
        marginBottom: 20,
    },
    quote: {
        color: 'gray',
        marginTop: 10,

        fontSize: responsiveFontSize(1.5),
    },
    BlogBox: {
        marginLeft: 10,
        //marginBottom: 10,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 3,
        height: responsiveHeight(30),
        width: responsiveWidth(45.7),
    },
    backgroundImage: {
        resizeMode: 'contain',
        flex: 1,
    },
    blackeffect: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 3,
        flex: 1,
    },
    blogtext1: {
        color: '#2ff4fd',
        marginTop: 10,

        fontSize: responsiveFontSize(1.7),
    },
    blogtext2: {
        color: '#fff',
        marginTop: 10,
        marginBottom: 20,

        fontSize: responsiveFontSize(1.5),
    },
    lastdiv: {
        flexDirection: 'row',
        marginBottom: 10,
        marginRight: 10,
    },
    cate_text: {
        fontSize: responsiveFontSize(1.9),
        marginTop: 5,
        marginBottom: 5,
        color: '#2F3237',
        paddingLeft: 3
    },
    cate_text_new: {
        fontSize: responsiveFontSize(1.5),
        marginTop: 5,
        marginBottom: 5,
        color: '#000',
    },
    userNmae: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        //textAlign: 'center'
    },
    userdesNmae: {
        fontSize: responsiveFontSize(1.7),
        color: '#6B6B6B',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        //textAlign: 'center'
    },
    amountuserNmae: {
        fontSize: responsiveFontSize(2),
        color: '#363636',

    },

    portionHeaderTextforar: {
        marginRight: 10,
        marginBottom: 10,
        marginTop: 10,
        color: '#000',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold'
    },
    lottie: {
        width: 100,
        height: 100,

    },
    discountprice: {
        textDecorationLine: 'line-through',
        fontSize: responsiveFontSize(2),
        marginLeft: 5,
        marginRight: 5,
    },
    containertab: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        height: responsiveHeight(8),
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent:'space-between',
        backgroundColor: '#EBEBEB'
    },
    button: {
        width: responsiveWidth(17),
        //height: responsiveHeight(50),
        marginLeft: 6,
        marginRight: 6,
        //paddingLeft: 22,
        //paddingRight: 22,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ProfileSettingcontainer: {
        flexDirection: 'row',
        paddingHorizontal: width / 35,
        paddingVertical: height / 65,
        justifyContent: 'space-between',
        alignItems: "center",
    },
    settingicon: {
        alignItems: "flex-end"
    },
    backbutton: {
        alignItems: "flex-start"
    },
    portionHeaderText: {
        marginTop: 15,
        marginBottom: 20,
        color: '#000',
        fontSize: responsiveFontSize(3),
        fontWeight: '500'
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
    Profilecontainer: {
        flex: 1,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center'
    },
    Profileimagecontainer: {
        alignItems: 'center',
        justifyContent: 'center'

    },
    UserImage: {
        alignSelf: 'center',
        marginTop: 15,
        width: 120,
        height: 120,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#F2F2F2',
    },
    UserName: {

        fontWeight: '500',
        color: '#303030',
        fontSize: responsiveFontSize(3),
        padding: 3,
        marginLeft: 5,
        marginRight: 5
    },
    checkbox: {
        alignSelf: "center",
    },
    label: {
        margin: 8,
        color: '#7D7D7D'
    },
    activeMenuView: {
        paddingLeft: 5,
        paddingRight: 5,
        height: responsiveHeight(5),
        marginRight: 10,
        backgroundColor: '#2F3237',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 8
    },
    activeMenuText: {
        fontSize: RFValue(12),
        color: '#EBE1D7',
        marginLeft: 5,
        fontWeight: "400",
        fontFamily: "OpenSans-Medium"
    },
    inactiveMenuView: {
        paddingLeft: 5,
        paddingRight: 5,
        height: responsiveHeight(5),
        marginRight: 10,
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 8
    },
    inactiveMenuText: {
        fontSize: RFValue(12),
        color: '#A1A1A1',
        marginLeft: 5,
        fontWeight: "400",
        fontFamily: "OpenSans-Medium"
    },
    searchSection: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E4E4E4',
        height: responsiveHeight(7),
        width: responsiveWidth(90),
        borderRadius: 5,
        marginBottom: 20,
    },
    cardSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E4E4E4',
        height: responsiveHeight(7),
        width: responsiveWidth(90),
        borderRadius: 5,
        marginBottom: 20,
    },
    searchSection_row1: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E4E4E4',
        height: responsiveHeight(7),
        width: responsiveWidth(44),
        borderRadius: 5,
        marginBottom: 20,
        marginRight: 8
    },
    searchSection_row2: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E4E4E4',
        height: responsiveHeight(7),
        width: responsiveWidth(44),
        borderRadius: 5,
        marginBottom: 20,
        //marginRight:8
    },
    searchIcon: {
        padding: 10,
        margin: 10,
        height: responsiveHeight(3),
        width: responsiveWidth(3),
    },
    cardIcon: {
        height: responsiveHeight(3),
        width: responsiveWidth(3),
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#E4E4E4',
        color: '#424242',
    },
    button_view: {
        //marginLeft: 20,
        //marginRight: 10,
        marginTop: 30,
        marginBottom: 30,
        alignItems: 'center',
        flex: 1,
    },
    buttonsubmit: {
        backgroundColor: '#2F3237',
        borderRadius: 10,
        height: responsiveHeight(6),
        width: responsiveWidth(88),
    },
    moreImg: {
        height: 70,
        width: 70,
        resizeMode: 'contain',
        marginRight: 5,
        borderRadius: 10,

    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }

});



const mapDispatchToProps = (dispatch) => ({
    // setAddress: (data) => dispatch(setAddress(data)),
    // setLatLng: (data) => dispatch(setLatLng(data)),
    // subLocalitys: (data) => dispatch(subLocalitys(data)),
});

function mapStateToProps(state) {
    return {
        token: state.userReducer.token,
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(MyBooking));


