import * as React from "react";
import { Metadata } from "grpc-web-client";
import { DalalActionService } from "../../../proto_build/DalalMessage_pb_service";


declare var $: any;

export interface CountryTelCodeProps {
    disabled: boolean
    countryCode: (country: string | null) => void
}

export interface CountryTelCodeState {

}

export class CountryTelCode extends React.Component<CountryTelCodeProps, CountryTelCodeState> {
    constructor(props: CountryTelCodeProps) {
        super(props);

    }
    componentDidMount() {
        let selectedCode="91";
        this.props.countryCode(selectedCode);
        $('#country-selector').dropdown()
        $('#country-selector').search()

    }

    handleCountryCodeChange = (event: React.FormEvent<HTMLDivElement>) => {

        let selectedCode:string = "";

        if(event.currentTarget.dataset.value!=undefined)
        {
            selectedCode=event.currentTarget.dataset.value;
          
        }
        console.log("called");
       
        
        // if (selectedCode != undefined) {
        //     this.props.countryCode(selectedCode);
        // }

    }

    render() {

        return (
            <div id="country-selector" className={"ui dropdown invert-me selection fluid dropdown-small "+ (this.props.disabled==true?"disabled":"") } >
                <input name="country" id="war" type="hidden" />
                <i className="dropdown icon"></i>
                <div className="default text" data-countryCode="IN" onClick={this.handleCountryCodeChange} data-text="+91" data-value="91"><i className="in flag"></i>+91</div>
                <div className="menu" id="country-code-selector"> 
                    <div className="item" data-countryCode="IN" onClick={this.handleCountryCodeChange} data-text="+91" data-value="91">India(+91)</div>
                    <div className="item" data-countryCode="GB" onClick={this.handleCountryCodeChange} data-text="+44" data-value="44">UK(+44)</div>
                    <div className="item" data-countryCode="US" onClick={this.handleCountryCodeChange} data-text="+1" data-value="1">USA(+1)</div>

                    <div className="item" data-countryCode="DZ" onClick={this.handleCountryCodeChange} data-text="+213" data-value="213">Algeria (+213)</div>
                    <div className="item" data-countryCode="AD" onClick={this.handleCountryCodeChange} data-text="+376" data-value="376">Andorra (+376)</div>
                    <div className="item" data-countryCode="AO" onClick={this.handleCountryCodeChange} data-text="+244" data-value="244">Angola (+244)</div>
                    <div className="item" data-countryCode="AI" onClick={this.handleCountryCodeChange} data-text="+1264" data-value="1264">Anguilla (+1264)</div>
                    <div className="item" data-countryCode="AG" onClick={this.handleCountryCodeChange} data-text="+1268" data-value="1268">Antigua &amp; Barbuda (+1268)</div>
                    <div className="item" data-countryCode="AR" onClick={this.handleCountryCodeChange} data-text="+54" data-value="54">Argentina (+54)</div>
                    <div className="item" data-countryCode="AM" onClick={this.handleCountryCodeChange} data-text="+374" data-value="374">Armenia (+374)</div>
                    <div className="item" data-countryCode="AW" onClick={this.handleCountryCodeChange} data-text="+297" data-value="297">Aruba (+297)</div>
                    <div className="item" data-countryCode="AU" onClick={this.handleCountryCodeChange} data-text="+61" data-value="61">Australia (+61)</div>
                    <div className="item" data-countryCode="AT" onClick={this.handleCountryCodeChange} data-text="+43" data-value="43">Austria (+43)</div>
                    <div className="item" data-countryCode="AZ" onClick={this.handleCountryCodeChange} data-text="+994" data-value="994">Azerbaijan (+994)</div>
                    <div className="item" data-countryCode="BS" onClick={this.handleCountryCodeChange} data-text="+1242" data-value="1242">Bahamas (+1242)</div>
                    <div className="item" data-countryCode="BH" onClick={this.handleCountryCodeChange} data-text="+973" data-value="973">Bahrain (+973)</div>
                    <div className="item" data-countryCode="BD" onClick={this.handleCountryCodeChange} data-text="+880" data-value="880">Bangladesh (+880)</div>
                    <div className="item" data-countryCode="BB" onClick={this.handleCountryCodeChange} data-text="+1246" data-value="1246">Barbados (+1246)</div>
                    <div className="item" data-countryCode="BY" onClick={this.handleCountryCodeChange} data-text="+375" data-value="375">Belarus (+375)</div>
                    <div className="item" data-countryCode="BE" onClick={this.handleCountryCodeChange} data-text="+32" data-value="32">Belgium (+32)</div>
                    <div className="item" data-countryCode="BZ" onClick={this.handleCountryCodeChange} data-text="+501" data-value="501">Belize (+501)</div>
                    <div className="item" data-countryCode="BJ" onClick={this.handleCountryCodeChange} data-text="+229" data-value="229">Benin (+229)</div>
                    <div className="item" data-countryCode="BM" onClick={this.handleCountryCodeChange} data-text="+1441" data-value="1441">Bermuda (+1441)</div>
                    <div className="item" data-countryCode="BT" onClick={this.handleCountryCodeChange} data-text="+975" data-value="975">Bhutan (+975)</div>
                    <div className="item" data-countryCode="BO" onClick={this.handleCountryCodeChange} data-text="+591" data-value="591">Bolivia (+591)</div>
                    <div className="item" data-countryCode="BA" onClick={this.handleCountryCodeChange} data-text="+387" data-value="387">Bosnia Herzegovina (+387)</div>
                    <div className="item" data-countryCode="BW" onClick={this.handleCountryCodeChange} data-text="+267" data-value="267">Botswana (+267)</div>
                    <div className="item" data-countryCode="BR" onClick={this.handleCountryCodeChange} data-text="+55" data-value="55">Brazil (+55)</div>
                    <div className="item" data-countryCode="BN" onClick={this.handleCountryCodeChange} data-text="+673" data-value="673">Brunei (+673)</div>
                    <div className="item" data-countryCode="BG" onClick={this.handleCountryCodeChange} data-text="+359" data-value="359">Bulgaria (+359)</div>
                    <div className="item" data-countryCode="BF" onClick={this.handleCountryCodeChange} data-text="+226" data-value="226">Burkina Faso (+226)</div>
                    <div className="item" data-countryCode="BI" onClick={this.handleCountryCodeChange} data-text="+257" data-value="257">Burundi (+257)</div>
                    <div className="item" data-countryCode="KH" onClick={this.handleCountryCodeChange} data-text="+855" data-value="855">Cambodia (+855)</div>
                    <div className="item" data-countryCode="CM" onClick={this.handleCountryCodeChange} data-text="+237" data-value="237">Cameroon (+237)</div>
                    <div className="item" data-countryCode="CA" onClick={this.handleCountryCodeChange} data-text="+1" data-value="1">Canada (+1)</div>
                    <div className="item" data-countryCode="CV" onClick={this.handleCountryCodeChange} data-text="+238" data-value="238">Cape Verde Islands (+238)</div>
                    <div className="item" data-countryCode="KY" onClick={this.handleCountryCodeChange} data-text="+1345" data-value="1345">Cayman Islands (+1345)</div>
                    <div className="item" data-countryCode="CF" onClick={this.handleCountryCodeChange} data-text="+236" data-value="236">Central African Republic (+236)</div>
                    <div className="item" data-countryCode="CL" onClick={this.handleCountryCodeChange} data-text="+56" data-value="56">Chile (+56)</div>
                    <div className="item" data-countryCode="CN" onClick={this.handleCountryCodeChange} data-text="+86" data-value="86">China (+86)</div>
                    <div className="item" data-countryCode="CO" onClick={this.handleCountryCodeChange} data-text="+57" data-value="57">Colombia (+57)</div>
                    <div className="item" data-countryCode="KM" onClick={this.handleCountryCodeChange} data-text="+269" data-value="269">Comoros (+269)</div>
                    <div className="item" data-countryCode="CG" onClick={this.handleCountryCodeChange} data-text="+242" data-value="242">Congo (+242)</div>
                    <div className="item" data-countryCode="CK" onClick={this.handleCountryCodeChange} data-text="+682" data-value="682">Cook Islands (+682)</div>
                    <div className="item" data-countryCode="CR" onClick={this.handleCountryCodeChange} data-text="+506" data-value="506">Costa Rica (+506)</div>
                    <div className="item" data-countryCode="HR" onClick={this.handleCountryCodeChange} data-text="+385" data-value="385">Croatia (+385)</div>
                    <div className="item" data-countryCode="CU" onClick={this.handleCountryCodeChange} data-text="+53" data-value="53">Cuba (+53)</div>
                    <div className="item" data-countryCode="CY" onClick={this.handleCountryCodeChange} data-text="+90392" data-value="90392">Cyprus North (+90392)</div>
                    <div className="item" data-countryCode="CY" onClick={this.handleCountryCodeChange} data-text="+357" data-value="357">Cyprus South (+357)</div>
                    <div className="item" data-countryCode="CZ" onClick={this.handleCountryCodeChange} data-text="+42" data-value="42">Czech Republic (+42)</div>
                    <div className="item" data-countryCode="DK" onClick={this.handleCountryCodeChange} data-text="+45" data-value="45">Denmark (+45)</div>
                    <div className="item" data-countryCode="DJ" onClick={this.handleCountryCodeChange} data-text="+253" data-value="253">Djibouti (+253)</div>
                    <div className="item" data-countryCode="DM" onClick={this.handleCountryCodeChange} data-text="+1809" data-value="1809">Dominica (+1809)</div>
                    <div className="item" data-countryCode="DO" onClick={this.handleCountryCodeChange} data-text="+1809" data-value="1809">Dominican Republic (+1809)</div>
                    <div className="item" data-countryCode="EC" onClick={this.handleCountryCodeChange} data-text="+593" data-value="593">Ecuador (+593)</div>
                    <div className="item" data-countryCode="EG" onClick={this.handleCountryCodeChange} data-text="+20" data-value="20">Egypt (+20)</div>
                    <div className="item" data-countryCode="SV" onClick={this.handleCountryCodeChange} data-text="+503" data-value="503">El Salvador (+503)</div>
                    <div className="item" data-countryCode="GQ" onClick={this.handleCountryCodeChange} data-text="+240" data-value="240">Equatorial Guinea (+240)</div>
                    <div className="item" data-countryCode="ER" onClick={this.handleCountryCodeChange} data-text="+291" data-value="291">Eritrea (+291)</div>
                    <div className="item" data-countryCode="EE" onClick={this.handleCountryCodeChange} data-text="+372" data-value="372">Estonia (+372)</div>
                    <div className="item" data-countryCode="ET" onClick={this.handleCountryCodeChange} data-text="+251" data-value="251">Ethiopia (+251)</div>
                    <div className="item" data-countryCode="FK" onClick={this.handleCountryCodeChange} data-text="+500" data-value="500">Falkland Islands (+500)</div>
                    <div className="item" data-countryCode="FO" onClick={this.handleCountryCodeChange} data-text="+298" data-value="298">Faroe Islands (+298)</div>
                    <div className="item" data-countryCode="FJ" onClick={this.handleCountryCodeChange} data-text="+679" data-value="679">Fiji (+679)</div>
                    <div className="item" data-countryCode="FI" onClick={this.handleCountryCodeChange} data-text="+358" data-value="358">Finland (+358)</div>
                    <div className="item" data-countryCode="FR" onClick={this.handleCountryCodeChange} data-text="+33" data-value="33">France (+33)</div>
                    <div className="item" data-countryCode="GF" onClick={this.handleCountryCodeChange} data-text="+594" data-value="594">French Guiana (+594)</div>
                    <div className="item" data-countryCode="PF" onClick={this.handleCountryCodeChange} data-text="+689" data-value="689">French Polynesia (+689)</div>
                    <div className="item" data-countryCode="GA" onClick={this.handleCountryCodeChange} data-text="+241" data-value="241">Gabon (+241)</div>
                    <div className="item" data-countryCode="GM" onClick={this.handleCountryCodeChange} data-text="+220" data-value="220">Gambia (+220)</div>
                    <div className="item" data-countryCode="GE" onClick={this.handleCountryCodeChange} data-text="+7880" data-value="7880">Georgia (+7880)</div>
                    <div className="item" data-countryCode="DE" onClick={this.handleCountryCodeChange} data-text="+49" data-value="49">Germany (+49)</div>
                    <div className="item" data-countryCode="GH" onClick={this.handleCountryCodeChange} data-text="+233" data-value="233">Ghana (+233)</div>
                    <div className="item" data-countryCode="GI" onClick={this.handleCountryCodeChange} data-text="+350" data-value="350">Gibraltar (+350)</div>
                    <div className="item" data-countryCode="GR" onClick={this.handleCountryCodeChange} data-text="+30" data-value="30">Greece (+30)</div>
                    <div className="item" data-countryCode="GL" onClick={this.handleCountryCodeChange} data-text="+299" data-value="299">Greenland (+299)</div>
                    <div className="item" data-countryCode="GD" onClick={this.handleCountryCodeChange} data-text="+1473" data-value="1473">Grenada (+1473)</div>
                    <div className="item" data-countryCode="GP" onClick={this.handleCountryCodeChange} data-text="+590" data-value="590">Guadeloupe (+590)</div>
                    <div className="item" data-countryCode="GU" onClick={this.handleCountryCodeChange} data-text="+671" data-value="671">Guam (+671)</div>
                    <div className="item" data-countryCode="GT" onClick={this.handleCountryCodeChange} data-text="+502" data-value="502">Guatemala (+502)</div>
                    <div className="item" data-countryCode="GN" onClick={this.handleCountryCodeChange} data-text="+224" data-value="224">Guinea (+224)</div>
                    <div className="item" data-countryCode="GW" onClick={this.handleCountryCodeChange} data-text="+245" data-value="245">Guinea - Bissau (+245)</div>
                    <div className="item" data-countryCode="GY" onClick={this.handleCountryCodeChange} data-text="+592" data-value="592">Guyana (+592)</div>
                    <div className="item" data-countryCode="HT" onClick={this.handleCountryCodeChange} data-text="+509" data-value="509">Haiti (+509)</div>
                    <div className="item" data-countryCode="HN" onClick={this.handleCountryCodeChange} data-text="+504" data-value="504">Honduras (+504)</div>
                    <div className="item" data-countryCode="HK" onClick={this.handleCountryCodeChange} data-text="+852" data-value="852">Hong Kong (+852)</div>
                    <div className="item" data-countryCode="HU" onClick={this.handleCountryCodeChange} data-text="+36" data-value="36">Hungary (+36)</div>
                    <div className="item" data-countryCode="IS" onClick={this.handleCountryCodeChange} data-text="+354" data-value="354">Iceland (+354)</div>
                    <div className="item" data-countryCode="IN" onClick={this.handleCountryCodeChange} data-text="+91" data-value="91">India (+91)</div>
                    <div className="item" data-countryCode="ID" onClick={this.handleCountryCodeChange} data-text="+62" data-value="62">Indonesia (+62)</div>
                    <div className="item" data-countryCode="IR" onClick={this.handleCountryCodeChange} data-text="+98" data-value="98">Iran (+98)</div>
                    <div className="item" data-countryCode="IQ" onClick={this.handleCountryCodeChange} data-text="+964" data-value="964">Iraq (+964)</div>
                    <div className="item" data-countryCode="IE" onClick={this.handleCountryCodeChange} data-text="+353" data-value="353">Ireland (+353)</div>
                    <div className="item" data-countryCode="IL" onClick={this.handleCountryCodeChange} data-text="+972" data-value="972">Israel (+972)</div>
                    <div className="item" data-countryCode="IT" onClick={this.handleCountryCodeChange} data-text="+39" data-value="39">Italy (+39)</div>
                    <div className="item" data-countryCode="JM" onClick={this.handleCountryCodeChange} data-text="+1876" data-value="1876">Jamaica (+1876)</div>
                    <div className="item" data-countryCode="JP" onClick={this.handleCountryCodeChange} data-text="+81" data-value="81">Japan (+81)</div>
                    <div className="item" data-countryCode="JO" onClick={this.handleCountryCodeChange} data-text="+962" data-value="962">Jordan (+962)</div>
                    <div className="item" data-countryCode="KZ" onClick={this.handleCountryCodeChange} data-text="+7" data-value="7">Kazakhstan (+7)</div>
                    <div className="item" data-countryCode="KE" onClick={this.handleCountryCodeChange} data-text="+254" data-value="254">Kenya (+254)</div>
                    <div className="item" data-countryCode="KI" onClick={this.handleCountryCodeChange} data-text="+686" data-value="686">Kiribati (+686)</div>
                    <div className="item" data-countryCode="KP" onClick={this.handleCountryCodeChange} data-text="+850" data-value="850">Korea North (+850)</div>
                    <div className="item" data-countryCode="KR" onClick={this.handleCountryCodeChange} data-text="+82" data-value="82">Korea South (+82)</div>
                    <div className="item" data-countryCode="KW" onClick={this.handleCountryCodeChange} data-text="+965" data-value="965">Kuwait (+965)</div>
                    <div className="item" data-countryCode="KG" onClick={this.handleCountryCodeChange} data-text="+966" data-value="996">Kyrgyzstan (+996)</div>
                    <div className="item" data-countryCode="LA" onClick={this.handleCountryCodeChange} data-text="+856" data-value="856">Laos (+856)</div>
                    <div className="item" data-countryCode="LV" onClick={this.handleCountryCodeChange} data-text="+371" data-value="371">Latvia (+371)</div>
                    <div className="item" data-countryCode="LB" onClick={this.handleCountryCodeChange} data-text="+961" data-value="961">Lebanon (+961)</div>
                    <div className="item" data-countryCode="LS" onClick={this.handleCountryCodeChange} data-text="+266" data-value="266">Lesotho (+266)</div>
                    <div className="item" data-countryCode="LR" onClick={this.handleCountryCodeChange} data-text="+231" data-value="231">Liberia (+231)</div>
                    <div className="item" data-countryCode="LY" onClick={this.handleCountryCodeChange} data-text="+218" data-value="218">Libya (+218)</div>
                    <div className="item" data-countryCode="LI" onClick={this.handleCountryCodeChange} data-text="+417" data-value="417">Liechtenstein (+417)</div>
                    <div className="item" data-countryCode="LT" onClick={this.handleCountryCodeChange} data-text="+370" data-value="370">Lithuania (+370)</div>
                    <div className="item" data-countryCode="LU" onClick={this.handleCountryCodeChange} data-text="+352" data-value="352">Luxembourg (+352)</div>
                    <div className="item" data-countryCode="MO" onClick={this.handleCountryCodeChange} data-text="+853" data-value="853">Macao (+853)</div>
                    <div className="item" data-countryCode="MK" onClick={this.handleCountryCodeChange} data-text="+389" data-value="389">Macedonia (+389)</div>
                    <div className="item" data-countryCode="MG" onClick={this.handleCountryCodeChange} data-text="+261" data-value="261">Madagascar (+261)</div>
                    <div className="item" data-countryCode="MW" onClick={this.handleCountryCodeChange} data-text="+265" data-value="265">Malawi (+265)</div>
                    <div className="item" data-countryCode="MY" onClick={this.handleCountryCodeChange} data-text="+60" data-value="60">Malaysia (+60)</div>
                    <div className="item" data-countryCode="MV" onClick={this.handleCountryCodeChange} data-text="+960" data-value="960">Maldives (+960)</div>
                    <div className="item" data-countryCode="ML" onClick={this.handleCountryCodeChange} data-text="+223" data-value="223">Mali (+223)</div>
                    <div className="item" data-countryCode="MT" onClick={this.handleCountryCodeChange} data-text="+356" data-value="356">Malta (+356)</div>
                    <div className="item" data-countryCode="MH" onClick={this.handleCountryCodeChange} data-text="+692" data-value="692">Marshall Islands (+692)</div>
                    <div className="item" data-countryCode="MQ" onClick={this.handleCountryCodeChange} data-text="+596" data-value="596">Martinique (+596)</div>
                    <div className="item" data-countryCode="MR" onClick={this.handleCountryCodeChange} data-text="+222" data-value="222">Mauritania (+222)</div>
                    <div className="item" data-countryCode="YT" onClick={this.handleCountryCodeChange} data-text="+269" data-value="269">Mayotte (+269)</div>
                    <div className="item" data-countryCode="MX" onClick={this.handleCountryCodeChange} data-text="+52" data-value="52">Mexico (+52)</div>
                    <div className="item" data-countryCode="FM" onClick={this.handleCountryCodeChange} data-text="+691" data-value="691">Micronesia (+691)</div>
                    <div className="item" data-countryCode="MD" onClick={this.handleCountryCodeChange} data-text="+373" data-value="373">Moldova (+373)</div>
                    <div className="item" data-countryCode="MC" onClick={this.handleCountryCodeChange} data-text="+377" data-value="377">Monaco (+377)</div>
                    <div className="item" data-countryCode="MN" onClick={this.handleCountryCodeChange} data-text="+976" data-value="976">Mongolia (+976)</div>
                    <div className="item" data-countryCode="MS" onClick={this.handleCountryCodeChange} data-text="+1664" data-value="1664">Montserrat (+1664)</div>
                    <div className="item" data-countryCode="MA" onClick={this.handleCountryCodeChange} data-text="+212" data-value="212">Morocco (+212)</div>
                    <div className="item" data-countryCode="MZ" onClick={this.handleCountryCodeChange} data-text="+258" data-value="258">Mozambique (+258)</div>
                    <div className="item" data-countryCode="MN" onClick={this.handleCountryCodeChange} data-text="+95" data-value="95">Myanmar (+95)</div>
                    <div className="item" data-countryCode="NA" onClick={this.handleCountryCodeChange} data-text="+264" data-value="264">Namibia (+264)</div>
                    <div className="item" data-countryCode="NR" onClick={this.handleCountryCodeChange} data-text="+674" data-value="674">Nauru (+674)</div>
                    <div className="item" data-countryCode="NP" onClick={this.handleCountryCodeChange} data-text="+977" data-value="977">Nepal (+977)</div>
                    <div className="item" data-countryCode="NL" onClick={this.handleCountryCodeChange} data-text="+31" data-value="31">Netherlands (+31)</div>
                    <div className="item" data-countryCode="NC" onClick={this.handleCountryCodeChange} data-text="+687" data-value="687">New Caledonia (+687)</div>
                    <div className="item" data-countryCode="NZ" onClick={this.handleCountryCodeChange} data-text="+64" data-value="64">New Zealand (+64)</div>
                    <div className="item" data-countryCode="NI" onClick={this.handleCountryCodeChange} data-text="+505" data-value="505">Nicaragua (+505)</div>
                    <div className="item" data-countryCode="NE" onClick={this.handleCountryCodeChange} data-text="+227" data-value="227">Niger (+227)</div>
                    <div className="item" data-countryCode="NG" onClick={this.handleCountryCodeChange} data-text="+234" data-value="234">Nigeria (+234)</div>
                    <div className="item" data-countryCode="NU" onClick={this.handleCountryCodeChange} data-text="+683" data-value="683">Niue (+683)</div>
                    <div className="item" data-countryCode="NF" onClick={this.handleCountryCodeChange} data-text="+672" data-value="672">Norfolk Islands (+672)</div>
                    <div className="item" data-countryCode="NP" onClick={this.handleCountryCodeChange} data-text="+670" data-value="670">Northern Marianas (+670)</div>
                    <div className="item" data-countryCode="NO" onClick={this.handleCountryCodeChange} data-text="+47" data-value="47">Norway (+47)</div>
                    <div className="item" data-countryCode="OM" onClick={this.handleCountryCodeChange} data-text="+968" data-value="968">Oman (+968)</div>
                    <div className="item" data-countryCode="PW" onClick={this.handleCountryCodeChange} data-text="+680" data-value="680">Palau (+680)</div>
                    <div className="item" data-countryCode="PA" onClick={this.handleCountryCodeChange} data-text="+507" data-value="507">Panama (+507)</div>
                    <div className="item" data-countryCode="PG" onClick={this.handleCountryCodeChange} data-text="+675" data-value="675">Papua New Guinea (+675)</div>
                    <div className="item" data-countryCode="PY" onClick={this.handleCountryCodeChange} data-text="+595" data-value="595">Paraguay (+595)</div>
                    <div className="item" data-countryCode="PE" onClick={this.handleCountryCodeChange} data-text="+51" data-value="51">Peru (+51)</div>
                    <div className="item" data-countryCode="PH" onClick={this.handleCountryCodeChange} data-text="+63" data-value="63">Philippines (+63)</div>
                    <div className="item" data-countryCode="PL" onClick={this.handleCountryCodeChange} data-text="+48" data-value="48">Poland (+48)</div>
                    <div className="item" data-countryCode="PT" onClick={this.handleCountryCodeChange} data-text="+351" data-value="351">Portugal (+351)</div>
                    <div className="item" data-countryCode="PR" onClick={this.handleCountryCodeChange} data-text="+1787" data-value="1787">Puerto Rico (+1787)</div>
                    <div className="item" data-countryCode="QA" onClick={this.handleCountryCodeChange} data-text="+974" data-value="974">Qatar (+974)</div>
                    <div className="item" data-countryCode="RE" onClick={this.handleCountryCodeChange} data-text="+262" data-value="262">Reunion (+262)</div>
                    <div className="item" data-countryCode="RO" onClick={this.handleCountryCodeChange} data-text="+40" data-value="40">Romania (+40)</div>
                    <div className="item" data-countryCode="RU" onClick={this.handleCountryCodeChange} data-text="+7" data-value="7">Russia (+7)</div>
                    <div className="item" data-countryCode="RW" onClick={this.handleCountryCodeChange} data-text="+250" data-value="250">Rwanda (+250)</div>
                    <div className="item" data-countryCode="SM" onClick={this.handleCountryCodeChange} data-text="+378" data-value="378">San Marino (+378)</div>
                    <div className="item" data-countryCode="ST" onClick={this.handleCountryCodeChange} data-text="+239" data-value="239">Sao Tome &amp; Principe (+239)</div>
                    <div className="item" data-countryCode="SA" onClick={this.handleCountryCodeChange} data-text="+966" data-value="966">Saudi Arabia (+966)</div>
                    <div className="item" data-countryCode="SN" onClick={this.handleCountryCodeChange} data-text="+221" data-value="221">Senegal (+221)</div>
                    <div className="item" data-countryCode="CS" onClick={this.handleCountryCodeChange} data-text="+381" data-value="381">Serbia (+381)</div>
                    <div className="item" data-countryCode="SC" onClick={this.handleCountryCodeChange} data-text="+248" data-value="248">Seychelles (+248)</div>
                    <div className="item" data-countryCode="SL" onClick={this.handleCountryCodeChange} data-text="+232" data-value="232">Sierra Leone (+232)</div>
                    <div className="item" data-countryCode="SG" onClick={this.handleCountryCodeChange} data-text="+65" data-value="65">Singapore (+65)</div>
                    <div className="item" data-countryCode="SK" onClick={this.handleCountryCodeChange} data-text="+421" data-value="421">Slovak Republic (+421)</div>
                    <div className="item" data-countryCode="SI" onClick={this.handleCountryCodeChange} data-text="+386" data-value="386">Slovenia (+386)</div>
                    <div className="item" data-countryCode="SB" onClick={this.handleCountryCodeChange} data-text="+677" data-value="677">Solomon Islands (+677)</div>
                    <div className="item" data-countryCode="SO" onClick={this.handleCountryCodeChange} data-text="+252" data-value="252">Somalia (+252)</div>
                    <div className="item" data-countryCode="ZA" onClick={this.handleCountryCodeChange} data-text="+27" data-value="27">South Africa (+27)</div>
                    <div className="item" data-countryCode="ES" onClick={this.handleCountryCodeChange} data-text="+34" data-value="34">Spain (+34)</div>
                    <div className="item" data-countryCode="LK" onClick={this.handleCountryCodeChange} data-text="+94" data-value="94">Sri Lanka (+94)</div>
                    <div className="item" data-countryCode="SH" onClick={this.handleCountryCodeChange} data-text="+290" data-value="290">St. Helena (+290)</div>
                    <div className="item" data-countryCode="KN" onClick={this.handleCountryCodeChange} data-text="+1869" data-value="1869">St. Kitts (+1869)</div>
                    <div className="item" data-countryCode="SC" onClick={this.handleCountryCodeChange} data-text="+1758" data-value="1758">St. Lucia (+1758)</div>
                    <div className="item" data-countryCode="SD" onClick={this.handleCountryCodeChange} data-text="+249" data-value="249">Sudan (+249)</div>
                    <div className="item" data-countryCode="SR" onClick={this.handleCountryCodeChange} data-text="+597" data-value="597">Suriname (+597)</div>
                    <div className="item" data-countryCode="SZ" onClick={this.handleCountryCodeChange} data-text="+268" data-value="268">Swaziland (+268)</div>
                    <div className="item" data-countryCode="SE" onClick={this.handleCountryCodeChange} data-text="+46" data-value="46">Sweden (+46)</div>
                    <div className="item" data-countryCode="CH" onClick={this.handleCountryCodeChange} data-text="+41" data-value="41">Switzerland (+41)</div>
                    <div className="item" data-countryCode="SI" onClick={this.handleCountryCodeChange} data-text="+963" data-value="963">Syria (+963)</div>
                    <div className="item" data-countryCode="TW" onClick={this.handleCountryCodeChange} data-text="+886" data-value="886">Taiwan (+886)</div>
                    <div className="item" data-countryCode="TJ" onClick={this.handleCountryCodeChange} data-text="+7" data-value="7">Tajikstan (+7)</div>
                    <div className="item" data-countryCode="TH" onClick={this.handleCountryCodeChange} data-text="+66" data-value="66">Thailand (+66)</div>
                    <div className="item" data-countryCode="TG" onClick={this.handleCountryCodeChange} data-text="+228" data-value="228">Togo (+228)</div>
                    <div className="item" data-countryCode="TO" onClick={this.handleCountryCodeChange} data-text="+676" data-value="676">Tonga (+676)</div>
                    <div className="item" data-countryCode="TT" onClick={this.handleCountryCodeChange} data-text="+1868" data-value="1868">Trinidad &amp; Tobago (+1868)</div>
                    <div className="item" data-countryCode="TN" onClick={this.handleCountryCodeChange} data-text="+216" data-value="216">Tunisia (+216)</div>
                    <div className="item" data-countryCode="TR" onClick={this.handleCountryCodeChange} data-text="+90" data-value="90">Turkey (+90)</div>
                    <div className="item" data-countryCode="TM" onClick={this.handleCountryCodeChange} data-text="+7" data-value="7">Turkmenistan (+7)</div>
                    <div className="item" data-countryCode="TM" onClick={this.handleCountryCodeChange} data-text="+993" data-value="993">Turkmenistan (+993)</div>
                    <div className="item" data-countryCode="TC" onClick={this.handleCountryCodeChange} data-text="+1649" data-value="1649">Turks &amp; Caicos Islands (+1649)</div>
                    <div className="item" data-countryCode="TV" onClick={this.handleCountryCodeChange} data-text="+688" data-value="688">Tuvalu (+688)</div>
                    <div className="item" data-countryCode="UG" onClick={this.handleCountryCodeChange} data-text="+256" data-value="256">Uganda (+256)</div>
                    <div className="item" data-countryCode="UA" onClick={this.handleCountryCodeChange} data-text="+380" data-value="380">Ukraine (+380)</div>
                    <div className="item" data-countryCode="AE" onClick={this.handleCountryCodeChange} data-text="+971" data-value="971">United Arab Emirates (+971)</div>
                    <div className="item" data-countryCode="UY" onClick={this.handleCountryCodeChange} data-text="+598" data-value="598">Uruguay (+598)</div>
                    <div className="item" data-countryCode="UZ" onClick={this.handleCountryCodeChange} data-text="+7" data-value="7">Uzbekistan (+7)</div>
                    <div className="item" data-countryCode="VU" onClick={this.handleCountryCodeChange} data-text="+678" data-value="678">Vanuatu (+678)</div>
                    <div className="item" data-countryCode="VA" onClick={this.handleCountryCodeChange} data-text="+379" data-value="379">Vatican City (+379)</div>
                    <div className="item" data-countryCode="VE" onClick={this.handleCountryCodeChange} data-text="+58" data-value="58">Venezuela (+58)</div>
                    <div className="item" data-countryCode="VN" onClick={this.handleCountryCodeChange} data-text="+84" data-value="84">Vietnam (+84)</div>
                    <div className="item" data-countryCode="VG" onClick={this.handleCountryCodeChange} data-text="+84" data-value="84">Virgin Islands - British (+1284)</div>
                    <div className="item" data-countryCode="VI" onClick={this.handleCountryCodeChange} data-text="+84" data-value="84">Virgin Islands - US (+1340)</div>
                    <div className="item" data-countryCode="WF" onClick={this.handleCountryCodeChange} data-text="+681" data-value="681">Wallis &amp; Futuna (+681)</div>
                    <div className="item" data-countryCode="YE" onClick={this.handleCountryCodeChange} data-text="+969" data-value="969">Yemen (North)(+969)</div>
                    <div className="item" data-countryCode="YE" onClick={this.handleCountryCodeChange} data-text="+967" data-value="967">Yemen (South)(+967)</div>
                    <div className="item" data-countryCode="ZM" onClick={this.handleCountryCodeChange} data-text="+260" data-value="260">Zambia (+260)</div>
                    <div className="item" data-countryCode="ZW" onClick={this.handleCountryCodeChange} data-text="+263" data-value="263">Zimbabwe (+263)</div>
                </div>

            </div>



        )
    }

}