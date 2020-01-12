import * as React from "react";
<<<<<<< HEAD
=======

>>>>>>> bc904a4f2c4431377294e27773cb7a6b4a183a55
import * as fp from "fingerprintjs2";
import { RegisterRequest, RegisterResponse } from "../../../proto_build/actions/Register_pb";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";





declare var $: any;

export interface RegisterFormProps {
}

export interface RegisterFormState {
    email: string,
    fullName: string,
    password: string,
    confirmPassword: string,
    country: string,
    disabled: boolean,
    error: string | null,
    successful: boolean,
}
export class RegisterForm extends React.Component<RegisterFormProps, RegisterFormState>{
    constructor(props: RegisterFormProps) {
        super(props)
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            country: "",
            disabled: false,
            error: null,
            successful: false
        };
    }
    componentDidMount() {
        $('#country-selector').dropdown()
        $('#country-selector').search()
    }
    handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            email: e.currentTarget.value
        });
    }
    handleConfirmPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            confirmPassword: e.currentTarget.value
        })
    }
    handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            password: e.currentTarget.value
        });
    }
    handleFullNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            fullName: e.currentTarget.value
        });
    }

    validateInput = (): string => {
        let errorMsg: string = "";

        // Email check
        let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (this.state.email.length == 0 || !regexp.test(this.state.email)) {
            errorMsg = "Enter a valid email";
        }
        else if (this.state.fullName.length == 0) {
            // Full name check
            errorMsg = "Enter a valid full name";
        }
        else if (this.state.password.length < 6) {
            // Non-empty password check
            errorMsg = "Password should be at least 6 characters excluding leading or trailing whitespaces";
        }
        else if (this.state.password != this.state.confirmPassword) {
            // confirm password check
            errorMsg = "Passwords doesn't match";
        }

        return errorMsg;
    }

    handleRegister = async () => {
        this.setState({
            disabled: true,
            country: (document.getElementById("country-selector") as HTMLDivElement)!!.innerText,
        });

        let error = this.validateInput();

        if (error.length > 0) {
            this.setState({
                error: error,
                successful: false,
                disabled: false,
            });
            return;
        }
  
<<<<<<< HEAD
  
            if (this.state.country != "Select Country") {
          
=======

      
 
        if (this.state.country != "Select Country") {
        
        
>>>>>>> bc904a4f2c4431377294e27773cb7a6b4a183a55
            let registerRequest = new RegisterRequest();
            registerRequest.setEmail(this.state.email);
            registerRequest.setPassword(this.state.password);
            registerRequest.setFullName(this.state.fullName);
            registerRequest.setCountry(this.state.country);
         
            this.registerUser(registerRequest);
        }
        this.setState({
            disabled: false,
            error: null,
        });

    }
    registerUser = async (registerRequest: RegisterRequest) => {
        try {
            const resp = await DalalActionService.register(registerRequest);
            this.setState({
                error:"An Email has been sent to your registered Email Id for verification.",
                successful: true,
            });
        } catch (e) {
            console.log(e);
            this.setState({
                error: e.isGrpcError ? "Unable to connect to the server. Please check your internet connection." : e.statusMessage,
                successful: false,
            });
        }
        // try{
        // let registerResponse= await DalalActionService.register(registerRequest)
        // }catch(e){
        //     console.log("Error Happened");

        // }   
        // this.props.registerSuccessHander(registerResponse)
    }
    render() {
        return (
            <div>
                <form className="ui large form">
                    <div className="ui attatched stacked secondary segment">
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="mail outline icon"></i>
                                <input type="text" name="email" placeholder="E-mail address" onChange={this.handleEmailChange} value={this.state.email} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="user icon"></i>
                                <input type="text" name="name" placeholder="Full Name" onChange={this.handleFullNameChange} value={this.state.fullName} />
                            </div>
                        </div>
                        <div id="country-selector" className="ui fluid selection dropdown field invert-me" >
                            <input name="country" id="war" type="hidden" />
                            <i className="dropdown icon"></i>
                            <div className="default text"><i className="in flag"></i>India</div>
                            <div className="menu" id="country-selector">
                                <div className="item" data-value="India"><i className="in flag"></i>India</div>
                                <div className="item" data-value="Afghanistan"><i className="af flag"></i>Afghanistan</div>
                                <div className="item" data-value="Aland Islands"><i className="ax flag"></i>Aland Islands</div>
                                <div className="item" data-value="Albania"><i className="al flag"></i>Albania</div>
                                <div className="item" data-value="Algeria"><i className="dz flag"></i>Algeria</div>
                                <div className="item" data-value="American Samoa"><i className="as flag"></i>American Samoa</div>
                                <div className="item" data-value="Andorra"><i className="ad flag"></i>Andorra</div>
                                <div className="item" data-value="Angola"><i className="ao flag"></i>Angola</div>
                                <div className="item" data-value="Anguilla"><i className="ai flag"></i>Anguilla</div>
                                <div className="item" data-value="Antigua"><i className="ag flag"></i>Antigua</div>
                                <div className="item" data-value="Argentina"><i className="ar flag"></i>Argentina</div>
                                <div className="item" data-value="Armenia"><i className="am flag"></i>Armenia</div>
                                <div className="item" data-value="Aruba"><i className="aw flag"></i>Aruba</div>
                                <div className="item" data-value="Australia"><i className="au flag"></i>Australia</div>
                                <div className="item" data-value="Austria"><i className="at flag"></i>Austria</div>
                                <div className="item" data-value="Azerbaijan"><i className="az flag"></i>Azerbaijan</div>
                                <div className="item" data-value="Bahamas"><i className="bs flag"></i>Bahamas</div>
                                <div className="item" data-value="Bahrain"><i className="bh flag"></i>Bahrain</div>
                                <div className="item" data-value="Bangladesh"><i className="bd flag"></i>Bangladesh</div>
                                <div className="item" data-value="Barbados"><i className="bb flag"></i>Barbados</div>
                                <div className="item" data-value="Belarus"><i className="by flag"></i>Belarus</div>
                                <div className="item" data-value="Belgium"><i className="be flag"></i>Belgium</div>
                                <div className="item" data-value="Belize"><i className="bz flag"></i>Belize</div>
                                <div className="item" data-value="Benin"><i className="bj flag"></i>Benin</div>
                                <div className="item" data-value="Bermuda"><i className="bm flag"></i>Bermuda</div>
                                <div className="item" data-value="Bhutan"><i className="bt flag"></i>Bhutan</div>
                                <div className="item" data-value="Bolivia"><i className="bo flag"></i>Bolivia</div>
                                <div className="item" data-value="Bosnia"><i className="ba flag"></i>Bosnia</div>
                                <div className="item" data-value="Botswana"><i className="bw flag"></i>Botswana</div>
                                <div className="item" data-value="Bouvet Island"><i className="bv flag"></i>Bouvet Island</div>
                                <div className="item" data-value="Brazil"><i className="br flag"></i>Brazil</div>
                                <div className="item" data-value="British Virgin Islands"><i className="vg flag"></i>British Virgin Islands</div>
                                <div className="item" data-value="Burundi"><i className="bi flag"></i>Burundi</div>
                                <div className="item" data-value="Caicos Islands"><i className="tc flag"></i>Caicos Islands</div>
                                <div className="item" data-value="Cambodia"><i className="kh flag"></i>Cambodia</div>
                                <div className="item" data-value="Cameroon"><i className="cm flag"></i>Cameroon</div>
                                <div className="item" data-value="Canada"><i className="ca flag"></i>Canada</div>
                                <div className="item" data-value="Cape Verde"><i className="cv flag"></i>Cape Verde</div>
                                <div className="item" data-value="Cayman Islands"><i className="ky flag"></i>Cayman Islands</div>
                                <div className="item" data-value="Central African Republic"><i className="cf flag"></i>Central African Republic</div>
                                <div className="item" data-value="Chad"><i className="td flag"></i>Chad</div>
                                <div className="item" data-value="Chile"><i className="cl flag"></i>Chile</div>
                                <div className="item" data-value="China"><i className="cn flag"></i>China</div>
                                <div className="item" data-value="Christmas Island"><i className="cx flag"></i>Christmas Island</div>
                                <div className="item" data-value="Cocos Islands"><i className="cc flag"></i>Cocos Islands</div>
                                <div className="item" data-value="Colombia"><i className="co flag"></i>Colombia</div>
                                <div className="item" data-value="Comoros"><i className="km flag"></i>Comoros</div>
                                <div className="item" data-value="Congo Brazzaville"><i className="cg flag"></i>Congo Brazzaville</div>
                                <div className="item" data-value="Congo"><i className="cd flag"></i>Congo</div>
                                <div className="item" data-value="Cook Islands"><i className="ck flag"></i>Cook Islands</div>
                                <div className="item" data-value="Costa Rica"><i className="cr flag"></i>Costa Rica</div>
                                <div className="item" data-value="Cote Divoire"><i className="ci flag"></i>Cote Divoire</div>
                                <div className="item" data-value="Croatia"><i className="hr flag"></i>Croatia</div>
                                <div className="item" data-value="Cuba"><i className="cu flag"></i>Cuba</div>
                                <div className="item" data-value="Cyprus"><i className="cy flag"></i>Cyprus</div>
                                <div className="item" data-value="Czech Republic"><i className="cz flag"></i>Czech Republic</div>
                                <div className="item" data-value="Denmark"><i className="dk flag"></i>Denmark</div>
                                <div className="item" data-value="Djibouti"><i className="dj flag"></i>Djibouti</div>
                                <div className="item" data-value="Dominica"><i className="dm flag"></i>Dominica</div>
                                <div className="item" data-value="Dominican Republic"><i className="do flag"></i>Dominican Republic</div>
                                <div className="item" data-value="Ecuador"><i className="ec flag"></i>Ecuador</div>
                                <div className="item" data-value="Egypt"><i className="eg flag"></i>Egypt</div>
                                <div className="item" data-value="El Salvador"><i className="sv flag"></i>El Salvador</div>
                                <div className="item" data-value="England"><i className="gb flag"></i>England</div>
                                <div className="item" data-value="Equatorial Guinea"><i className="gq flag"></i>Equatorial Guinea</div>
                                <div className="item" data-value="Eritrea"><i className="er flag"></i>Eritrea</div>
                                <div className="item" data-value="Estonia"><i className="ee flag"></i>Estonia</div>
                                <div className="item" data-value="Ethiopia"><i className="et flag"></i>Ethiopia</div>
                                <div className="item" data-value="European Union"><i className="eu flag"></i>European Union</div>
                                <div className="item" data-value="Falkland Islands"><i className="fk flag"></i>Falkland Islands</div>
                                <div className="item" data-value="Faroe Islands"><i className="fo flag"></i>Faroe Islands</div>
                                <div className="item" data-value="Fiji"><i className="fj flag"></i>Fiji</div>
                                <div className="item" data-value="Finland"><i className="fi flag"></i>Finland</div>
                                <div className="item" data-value="France"><i className="fr flag"></i>France</div>
                                <div className="item" data-value="French Guiana"><i className="gf flag"></i>French Guiana</div>
                                <div className="item" data-value="French Polynesia"><i className="pf flag"></i>French Polynesia</div>
                                <div className="item" data-value="French Territories"><i className="tf flag"></i>French Territories</div>
                                <div className="item" data-value="Gabon"><i className="ga flag"></i>Gabon</div>
                                <div className="item" data-value="Gambia"><i className="gm flag"></i>Gambia</div>
                                <div className="item" data-value="Georgia"><i className="ge flag"></i>Georgia</div>
                                <div className="item" data-value="Germany"><i className="de flag"></i>Germany</div>
                                <div className="item" data-value="Ghana"><i className="gh flag"></i>Ghana</div>
                                <div className="item" data-value="Gibraltar"><i className="gi flag"></i>Gibraltar</div>
                                <div className="item" data-value="Greece"><i className="gr flag"></i>Greece</div>
                                <div className="item" data-value="Greenland"><i className="gl flag"></i>Greenland</div>
                                <div className="item" data-value="Grenada"><i className="gd flag"></i>Grenada</div>
                                <div className="item" data-value="Guadeloupe"><i className="gp flag"></i>Guadeloupe</div>
                                <div className="item" data-value="Guam"><i className="gu flag"></i>Guam</div>
                                <div className="item" data-value="Guatemala"><i className="gt flag"></i>Guatemala</div>
                                <div className="item" data-value="Guinea-Bissau"><i className="gw flag"></i>Guinea-Bissau</div>
                                <div className="item" data-value="Guinea"><i className="gn flag"></i>Guinea</div>
                                <div className="item" data-value="Guyana"><i className="gy flag"></i>Guyana</div>
                                <div className="item" data-value="Haiti"><i className="ht flag"></i>Haiti</div>
                                <div className="item" data-value="Heard Island"><i className="hm flag"></i>Heard Island</div>
                                <div className="item" data-value="Honduras"><i className="hn flag"></i>Honduras</div>
                                <div className="item" data-value="Hong Kong"><i className="hk flag"></i>Hong Kong</div>
                                <div className="item" data-value="Hungary"><i className="hu flag"></i>Hungary</div>
                                <div className="item" data-value="Iceland"><i className="is flag"></i>Iceland</div>
                                <div className="item" data-value="Indian Ocean Territory"><i className="io flag"></i>Indian Ocean Territory</div>
                                <div className="item" data-value="Indonesia"><i className="id flag"></i>Indonesia</div>
                                <div className="item" data-value="Iran"><i className="ir flag"></i>Iran</div>
                                <div className="item" data-value="Iraq"><i className="iq flag"></i>Iraq</div>
                                <div className="item" data-value="Ireland"><i className="ie flag"></i>Ireland</div>
                                <div className="item" data-value="Israel"><i className="il flag"></i>Israel</div>
                                <div className="item" data-value="Italy"><i className="it flag"></i>Italy</div>
                                <div className="item" data-value="Jamaica"><i className="jm flag"></i>Jamaica</div>
                                <div className="item" data-value="Japan"><i className="jp flag"></i>Japan</div>
                                <div className="item" data-value="Jordan"><i className="jo flag"></i>Jordan</div>
                                <div className="item" data-value="Kazakhstan"><i className="kz flag"></i>Kazakhstan</div>
                                <div className="item" data-value="Kenya"><i className="ke flag"></i>Kenya</div>
                                <div className="item" data-value="Kiribati"><i className="ki flag"></i>Kiribati</div>
                                <div className="item" data-value="Kuwait"><i className="kw flag"></i>Kuwait</div>
                                <div className="item" data-value="Kyrgyzstan"><i className="kg flag"></i>Kyrgyzstan</div>
                                <div className="item" data-value="Laos"><i className="la flag"></i>Laos</div>
                                <div className="item" data-value="Latvia"><i className="lv flag"></i>Latvia</div>
                                <div className="item" data-value="Lebanon"><i className="lb flag"></i>Lebanon</div>
                                <div className="item" data-value="Lesotho"><i className="ls flag"></i>Lesotho</div>
                                <div className="item" data-value="Liberia"><i className="lr flag"></i>Liberia</div>
                                <div className="item" data-value="Libya"><i className="ly flag"></i>Libya</div>
                                <div className="item" data-value="Liechtenstein"><i className="li flag"></i>Liechtenstein</div>
                                <div className="item" data-value="Lithuania"><i className="lt flag"></i>Lithuania</div>
                                <div className="item" data-value="Luxembourg"><i className="lu flag"></i>Luxembourg</div>
                                <div className="item" data-value="Macau"><i className="mo flag"></i>Macau</div>
                                <div className="item" data-value="Macedonia"><i className="mk flag"></i>Macedonia</div>
                                <div className="item" data-value="Madagascar"><i className="mg flag"></i>Madagascar</div>
                                <div className="item" data-value="Malawi"><i className="mw flag"></i>Malawi</div>
                                <div className="item" data-value="Malaysia"><i className="my flag"></i>Malaysia</div>
                                <div className="item" data-value="Maldives"><i className="mv flag"></i>Maldives</div>
                                <div className="item" data-value="Mali"><i className="ml flag"></i>Mali</div>
                                <div className="item" data-value="Malta"><i className="mt flag"></i>Malta</div>
                                <div className="item" data-value="Marshall Islands"><i className="mh flag"></i>Marshall Islands</div>
                                <div className="item" data-value="Martinique"><i className="mq flag"></i>Martinique</div>
                                <div className="item" data-value="Mauritania"><i className="mr flag"></i>Mauritania</div>
                                <div className="item" data-value="Mauritius"><i className="mu flag"></i>Mauritius</div>
                                <div className="item" data-value="Mayotte"><i className="yt flag"></i>Mayotte</div>
                                <div className="item" data-value="Mexico"><i className="mx flag"></i>Mexico</div>
                                <div className="item" data-value="Micronesia"><i className="fm flag"></i>Micronesia</div>
                                <div className="item" data-value="Moldova"><i className="md flag"></i>Moldova</div>
                                <div className="item" data-value="Monaco"><i className="mc flag"></i>Monaco</div>
                                <div className="item" data-value="Mongolia"><i className="mn flag"></i>Mongolia</div>
                                <div className="item" data-value="Montenegro"><i className="me flag"></i>Montenegro</div>
                                <div className="item" data-value="Montserrat"><i className="ms flag"></i>Montserrat</div>
                                <div className="item" data-value="Morocco"><i className="ma flag"></i>Morocco</div>
                                <div className="item" data-value="Mozambique"><i className="mz flag"></i>Mozambique</div>
                                <div className="item" data-value="Namibia"><i className="na flag"></i>Namibia</div>
                                <div className="item" data-value="Nauru"><i className="nr flag"></i>Nauru</div>
                                <div className="item" data-value="Nepal"><i className="np flag"></i>Nepal</div>
                                <div className="item" data-value="Netherlands Antilles"><i className="an flag"></i>Netherlands Antilles</div>
                                <div className="item" data-value="Netherlands"><i className="nl flag"></i>Netherlands</div>
                                <div className="item" data-value="New Caledonia"><i className="nc flag"></i>New Caledonia</div>
                                <div className="item" data-value="New Guinea"><i className="pg flag"></i>New Guinea</div>
                                <div className="item" data-value="New Zealand"><i className="nz flag"></i>New Zealand</div>
                                <div className="item" data-value="Nicaragua"><i className="ni flag"></i>Nicaragua</div>
                                <div className="item" data-value="Niger"><i className="ne flag"></i>Niger</div>
                                <div className="item" data-value="Nigeria"><i className="ng flag"></i>Nigeria</div>
                                <div className="item" data-value="Niue"><i className="nu flag"></i>Niue</div>
                                <div className="item" data-value="Norfolk Island"><i className="nf flag"></i>Norfolk Island</div>
                                <div className="item" data-value="North Korea"><i className="kp flag"></i>North Korea</div>
                                <div className="item" data-value="Northern Mariana Islands"><i className="mp flag"></i>Northern Mariana Islands</div>
                                <div className="item" data-value="Norway"><i className="no flag"></i>Norway</div>
                                <div className="item" data-value="Oman"><i className="om flag"></i>Oman</div>
                                <div className="item" data-value="Pakistan"><i className="pk flag"></i>Pakistan</div>
                                <div className="item" data-value="Palau"><i className="pw flag"></i>Palau</div>
                                <div className="item" data-value="Palestine"><i className="ps flag"></i>Palestine</div>
                                <div className="item" data-value="Panama"><i className="pa flag"></i>Panama</div>
                                <div className="item" data-value="Paraguay"><i className="py flag"></i>Paraguay</div>
                                <div className="item" data-value="Peru"><i className="pe flag"></i>Peru</div>
                                <div className="item" data-value="Philippines"><i className="ph flag"></i>Philippines</div>
                                <div className="item" data-value="Pitcairn Islands"><i className="pn flag"></i>Pitcairn Islands</div>
                                <div className="item" data-value="Poland"><i className="pl flag"></i>Poland</div>
                                <div className="item" data-value="Portugal"><i className="pt flag"></i>Portugal</div>
                                <div className="item" data-value="Puerto Rico"><i className="pr flag"></i>Puerto Rico</div>
                                <div className="item" data-value="Qatar"><i className="qa flag"></i>Qatar</div>
                                <div className="item" data-value="Reunion"><i className="re flag"></i>Reunion</div>
                                <div className="item" data-value="Romania"><i className="ro flag"></i>Romania</div>
                                <div className="item" data-value="Russia"><i className="ru flag"></i>Russia</div>
                                <div className="item" data-value="Rwanda"><i className="rw flag"></i>Rwanda</div>
                                <div className="item" data-value="Saint Helena"><i className="sh flag"></i>Saint Helena</div>
                                <div className="item" data-value="Saint Kitts and Nevis"><i className="kn flag"></i>Saint Kitts and Nevis</div>
                                <div className="item" data-value="Saint Lucia"><i className="lc flag"></i>Saint Lucia</div>
                                <div className="item" data-value="Saint Pierre"><i className="pm flag"></i>Saint Pierre</div>
                                <div className="item" data-value="Saint Vincent"><i className="vc flag"></i>Saint Vincent</div>
                                <div className="item" data-value="Samoa"><i className="ws flag"></i>Samoa</div>
                                <div className="item" data-value="San Marino"><i className="sm flag"></i>San Marino</div>
                                <div className="item" data-value="Sandwich Islands"><i className="gs flag"></i>Sandwich Islands</div>
                                <div className="item" data-value="Sao Tome"><i className="st flag"></i>Sao Tome</div>
                                <div className="item" data-value="Saudi Arabia"><i className="sa flag"></i>Saudi Arabia</div>
                                <div className="item" data-value="Senegal"><i className="sn flag"></i>Senegal</div>
                                <div className="item" data-value="Serbia"><i className="cs flag"></i>Serbia</div>
                                <div className="item" data-value="Serbia"><i className="rs flag"></i>Serbia</div>
                                <div className="item" data-value="Seychelles"><i className="sc flag"></i>Seychelles</div>
                                <div className="item" data-value="Sierra Leone"><i className="sl flag"></i>Sierra Leone</div>
                                <div className="item" data-value="Singapore"><i className="sg flag"></i>Singapore</div>
                                <div className="item" data-value="Slovakia"><i className="sk flag"></i>Slovakia</div>
                                <div className="item" data-value="Slovenia"><i className="si flag"></i>Slovenia</div>
                                <div className="item" data-value="Solomon Islands"><i className="sb flag"></i>Solomon Islands</div>
                                <div className="item" data-value="Somalia"><i className="so flag"></i>Somalia</div>
                                <div className="item" data-value="South Africa"><i className="za flag"></i>South Africa</div>
                                <div className="item" data-value="South Korea"><i className="kr flag"></i>South Korea</div>
                                <div className="item" data-value="Spain"><i className="es flag"></i>Spain</div>
                                <div className="item" data-value="Sri Lanka"><i className="lk flag"></i>Sri Lanka</div>
                                <div className="item" data-value="Sudan"><i className="sd flag"></i>Sudan</div>
                                <div className="item" data-value="Suriname"><i className="sr flag"></i>Suriname</div>
                                <div className="item" data-value="Svalbard"><i className="sj flag"></i>Svalbard</div>
                                <div className="item" data-value="Swaziland"><i className="sz flag"></i>Swaziland</div>
                                <div className="item" data-value="Sweden"><i className="se flag"></i>Sweden</div>
                                <div className="item" data-value="Switzerland"><i className="ch flag"></i>Switzerland</div>
                                <div className="item" data-value="Syria"><i className="sy flag"></i>Syria</div>
                                <div className="item" data-value="Taiwan"><i className="tw flag"></i>Taiwan</div>
                                <div className="item" data-value="Tajikistan"><i className="tj flag"></i>Tajikistan</div>
                                <div className="item" data-value="Tanzania"><i className="tz flag"></i>Tanzania</div>
                                <div className="item" data-value="Thailand"><i className="th flag"></i>Thailand</div>
                                <div className="item" data-value="Timorleste"><i className="tl flag"></i>Timorleste</div>
                                <div className="item" data-value="Togo"><i className="tg flag"></i>Togo</div>
                                <div className="item" data-value="Tokelau"><i className="tk flag"></i>Tokelau</div>
                                <div className="item" data-value="Tonga"><i className="to flag"></i>Tonga</div>
                                <div className="item" data-value="Trinidad"><i className="tt flag"></i>Trinidad</div>
                                <div className="item" data-value="Tunisia"><i className="tn flag"></i>Tunisia</div>
                                <div className="item" data-value="Turkey"><i className="tr flag"></i>Turkey</div>
                                <div className="item" data-value="Turkmenistan"><i className="tm flag"></i>Turkmenistan</div>
                                <div className="item" data-value="Tuvalu"><i className="tv flag"></i>Tuvalu</div>
                                <div className="item" data-value="Uganda"><i className="ug flag"></i>Uganda</div>
                                <div className="item" data-value="Ukraine"><i className="ua flag"></i>Ukraine</div>
                                <div className="item" data-value="United Arab Emirates"><i className="ae flag"></i>United Arab Emirates</div>
                                <div className="item" data-value="United States"><i className="us flag"></i>United States</div>
                                <div className="item" data-value="Uruguay"><i className="uy flag"></i>Uruguay</div>
                                <div className="item" data-value="Us Minor Islands"><i className="um flag"></i>Us Minor Islands</div>
                                <div className="item" data-value="Us Virgin Islands"><i className="vi flag"></i>Us Virgin Islands</div>
                                <div className="item" data-value="Uzbekistan"><i className="uz flag"></i>Uzbekistan</div>
                                <div className="item" data-value="Vanuatu"><i className="vu flag"></i>Vanuatu</div>
                                <div className="item" data-value="Vatican City"><i className="va flag"></i>Vatican City</div>
                                <div className="item" data-value="Venezuela"><i className="ve flag"></i>Venezuela</div>
                                <div className="item" data-value="Vietnam"><i className="vn flag"></i>Vietnam</div>
                                <div className="item" data-value="Wallis and Futuna"><i className="wf flag"></i>Wallis and Futuna</div>
                                <div className="item" data-value="Western Sahara"><i className="eh flag"></i>Western Sahara</div>
                                <div className="item" data-value="Yemen"><i className="ye flag"></i>Yemen</div>
                                <div className="item" data-value="Zambia"><i className="zm flag"></i>Zambia</div>
                                <div className="item" data-value="Zimbabwe"><i className="zw flag"></i>Zimbabwe</div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                                <i className="lock icon"></i>
                                <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordChange} value={this.state.password} />
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui left icon input">
                            <i className="lock icon"></i>
                                <input type="password" name="name" placeholder="Confirm Password" onChange={this.handleConfirmPasswordChange} value={this.state.confirmPassword} />
                            </div>
                        </div>
                        {this.state.disabled ?
                            <div className="ui fluid large teal submit disabled button">Register</div> :
                            <div className="ui fluid large teal submit button" onClick={this.handleRegister}>Register</div>
                        }
                    </div>
                </form>
                {this.state.error != null && !this.state.successful && <div className="ui negative bottom attached message">
                    <i className="icon error"></i>
                    {this.state.error}
                </div>}
                {this.state.error != null && this.state.successful && <div className="ui positive bottom attached message">
                    <i className="icon success"></i>
                    {this.state.error}
                </div>}
            </div>
        );
    }
}
