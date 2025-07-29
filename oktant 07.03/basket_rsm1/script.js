
BasketPoolQuantity = function ()
{
    this.processing = false;
    this.poolQuantity = {};
    this.updateTimer = null;
    this.currentQuantity = {};
    this.lastStableQuantities = {};

    this.updateQuantity();
};


BasketPoolQuantity.prototype.updateQuantity = function ()
{

    //var items = BX('basket_items');
    var items = get_BasketItems();
    console.log(items);

    if (basketJSParams['USE_ENHANCED_ECOMMERCE'] === 'Y')
    {
        //checkAnalytics(this.lastStableQuantities, items);
    }

    if (!!items && items.length > 0)
    {
        for (var i = 0; i < items.length ; i++)
        {
            var itemId = items[i].id;
            this.currentQuantity[itemId] = BX('QUANTITY_' + itemId).value;
        }
    }

    this.lastStableQuantities = BX.clone(this.currentQuantity, true);
};


BasketPoolQuantity.prototype.changeQuantity = function (itemId)
{
    //console.log('bskPool  changeQuantity', itemId);
    
    var quantity = BX('QUANTITY_' + itemId).value;
    var isPoolEmpty = this.isPoolEmpty();

    //console.log(this.currentQuantity);

    if (this.currentQuantity[itemId] && this.currentQuantity[itemId] != quantity)
    {
        this.poolQuantity[itemId] = this.currentQuantity[itemId] = quantity;
    }

    //console.log(this.currentQuantity);

    if (!isPoolEmpty)
    {
        //console.log('! isPoolEmpty');
        this.enableTimer(true);
    } else
    {
        //console.log(' PoolEmpty');
        this.trySendPool();
    }
};


BasketPoolQuantity.prototype.trySendPool = function ()
{
    //console.log(this.isPoolEmpty(), this.isProcessing());
    
    if (!this.isPoolEmpty() && !this.isProcessing())
    {
        //console.log(' !isPoolEmpty && !isProcessing');
        this.enableTimer(false);
        recalcBasketAjax({});
    }
};

BasketPoolQuantity.prototype.isPoolEmpty = function ()
{
    return (Object.keys(this.poolQuantity).length == 0);
};

BasketPoolQuantity.prototype.clearPool = function ()
{
    this.poolQuantity = {};
};

BasketPoolQuantity.prototype.isProcessing = function ()
{
    return (this.processing === true);
};

BasketPoolQuantity.prototype.setProcessing = function (value)
{
    this.processing = (value === true);
};

BasketPoolQuantity.prototype.enableTimer = function (value)
{
    clearTimeout(this.updateTimer);
    if (value === false)
        return;

    this.updateTimer = setTimeout(function () {
        basketPoolQuantity.trySendPool();
    }, 1500);
};



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//список отложенных
function get_DelayedItems() {
    var array = BX.findChildren(BX('delayed_items'), {tag: 'div', className: 'js_delayed_item'}, true);
    return array;
}
//список корзинных
function get_BasketItems() {
    var array = BX.findChildren(BX('basket_items'), {tag: 'tr', className: 'js_basket_item'}, true);
    return array;
}


//формат цены
function price_cel_drob( price ) {
    price = Math.round(price * 100) / 100;
    var indx = (price + "").indexOf('.');
    var x1,x2;
    if (indx>=0) {
        var parts = (price + "").split('.');
        x1 = parts[0];    
        x2 = parts[1];    
    } else {
        x1 = price;
        x2 = 0;
    }
    x1 += '';
    var len = x1.length,
        output = '',
        i = len - 1;
    while(i >= 0) {
        output = x1.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = ' ' + output;
        }
        --i;
    }    
    var drob =(x2+'00').substr(0,2);
    return output + ' <sup>' + (drob+'') + '</sup>';
}

//console.log( 'xxxxx',  price_cel_drob(825.0000000000001) );


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//обновление корзины ajax-ом
function recalcBasketAjax(params)
{
    console.log('recalcBasketAjax');

    if (basketPoolQuantity.isProcessing())
    {
        return false;
    }

    BX.showWait();

    var property_values = {},
            action_var = BX('action_var').value,
            items = get_BasketItems(), //  BX('basket_items'),
            delayedItems = get_DelayedItems(), // BX('delayed_items'),
            postData,
            i;

    postData = {
        'sessid': BX.bitrix_sessid(),
        'site_id': BX.message('SITE_ID'),
        'props': property_values,
        'action_var': action_var,
        'select_props': BX('column_headers').value,
        'offers_props': BX('offers_props').value,
        'quantity_float': 'N', //BX('quantity_float').value,
        'price_vat_show_value': BX('price_vat_show_value').value,
        'hide_coupon': BX('hide_coupon').value,
        'use_prepayment': BX('use_prepayment').value
    };
    postData[action_var] = 'recalculate';
    if (!!params && typeof params === 'object')
    {
        for (i in params)
        {
            if (params.hasOwnProperty(i))
                postData[i] = params[i];
        }
    }

    if (!!items && items.length > 0)
    {
        for (i = 0; i < items.length; i++)
            postData['QUANTITY_' + items[i].id] = BX('QUANTITY_' + items[i].id).value;
    }

    if (!!delayedItems && delayedItems.length > 0)
    {
        for (i = 0; i < delayedItems.length; i++)
            postData['DELAY_' + delayedItems[i].id] = 'Y';
    }

    basketPoolQuantity.setProcessing(true);
    basketPoolQuantity.clearPool();

    console.log('postData', postData);

    BX.ajax({
        url: '/bitrix/components/bitrix/sale.basket.basket/ajax.php',
        method: 'POST',
        data: postData,
        dataType: 'json',
        onsuccess: function (result)
        {
            BX.closeWait();
            basketPoolQuantity.setProcessing(false);

            if (params.coupon)
            {
                //hello, gifts!
                if (!!result && !!result.BASKET_DATA && !!result.BASKET_DATA.NEED_TO_RELOAD_FOR_GETTING_GIFTS)
                {
                    BX.reload();
                }
            }

            if (basketPoolQuantity.isPoolEmpty())
            {
                updateBasketTable(null, result);
                basketPoolQuantity.updateQuantity();
            } else
            {
                basketPoolQuantity.enableTimer(true);
            }
        }
    });
}


// обновление корзины после ajax
// @param basketItemId
// @param {{BASKET_ID : string, BASKET_DATA : { GRID : { ROWS : {} }}, COLUMNS: {}, PARAMS: {}, DELETE_ORIGINAL : string }} res
function updateBasketTable(basketItemId, res)
{
    console.log(res);
    
    var id;
    
    // update product params after recalculation
    if (!!res.BASKET_DATA)
    {
        for (id in res.BASKET_DATA.GRID.ROWS)
        {
            console.log('id : ' + id);
            if (res.BASKET_DATA.GRID.ROWS.hasOwnProperty(id))
            {
                var item = res.BASKET_DATA.GRID.ROWS[id];

                /*
                if (BX('discount_value_' + id))
                    BX('discount_value_' + id).innerHTML = item.DISCOUNT_PRICE_PERCENT_FORMATED;
                if (BX('old_price_' + id))
                    BX('old_price_' + id).innerHTML = price_cel_drob( (item.DISCOUNT_PRICE > 0) ? item.FULL_PRICE : '' );
                */

                if (BX('current_price_' + id))
                    BX('current_price_' + id).innerHTML = price_cel_drob( item.PRICE );
                
                if (BX('sum_' + id))
                    BX('sum_' + id).innerHTML = price_cel_drob( item.SUM_VALUE );

                // if the quantity was set by user to 0 or was too much, we need to show corrected quantity value from ajax response
                if (BX('QUANTITY_' + id))
                {
                    BX('QUANTITY_INPUT_' + id).value = item.QUANTITY +  $("#QUANTITY_INPUT_" + id).data('desc');
                    BX('QUANTITY_INPUT_' + id).defaultValue = item.QUANTITY;

                    BX('QUANTITY_' + id).value = item.QUANTITY;
                }
            }
        }
    }



    // update coupon info
    // if (!!res.BASKET_DATA)  couponListUpdate(res.BASKET_DATA);

    // update warnings if any
    if (res.hasOwnProperty('WARNING_MESSAGE'))
    {
        var warningText = '';

        for (i = res['WARNING_MESSAGE'].length - 1; i >= 0; i--)
            warningText += res['WARNING_MESSAGE'][i] + '<br/>';

        BX('warning_message').innerHTML = warningText;
    }

    // update total basket values
    if (!!res.BASKET_DATA)
    {
        
        /*
        if (BX('allWeight_FORMATED'))
            BX('allWeight_FORMATED').innerHTML = res['BASKET_DATA']['allWeight_FORMATED'].replace(/\s/g, '&nbsp;');

        if (BX('allSum_wVAT_FORMATED'))
            BX('allSum_wVAT_FORMATED').innerHTML = res['BASKET_DATA']['allSum_wVAT_FORMATED'].replace(/\s/g, '&nbsp;');

        if (BX('allVATSum_FORMATED'))
            BX('allVATSum_FORMATED').innerHTML = res['BASKET_DATA']['allVATSum_FORMATED'].replace(/\s/g, '&nbsp;');
        
        if (BX('PRICE_WITHOUT_DISCOUNT'))
        {
            var showPriceWithoutDiscount = (res['BASKET_DATA']['PRICE_WITHOUT_DISCOUNT'] != res['BASKET_DATA']['allSum_FORMATED']);
            BX('PRICE_WITHOUT_DISCOUNT').innerHTML = showPriceWithoutDiscount ? res['BASKET_DATA']['PRICE_WITHOUT_DISCOUNT'].replace(/\s/g, '&nbsp;') : '';
            BX.style(BX('PRICE_WITHOUT_DISCOUNT').parentNode, 'display', (showPriceWithoutDiscount ? 'table-row' : 'none'));
        }
        */

        if (BX('allSum')) {			
            /*console.log(res['BASKET_DATA']['allSum'] );*/
            BX('allSum').innerHTML = price_cel_drob ( res['BASKET_DATA']['allSum'] );
			/*минимальная сумма заказа*/
			var mininalsumm = $('#mininalsumm').val();
			var cartsumm = Math.round(res['BASKET_DATA']['allSum']);				
			if(cartsumm>=mininalsumm) {				
				$('#cartbtnorder').removeClass('hidecartbtn');
				$('#cartbtncatalog').addClass('hidecartbtn');				
			}
			else {		
				$('#cartbtnorder').addClass('hidecartbtn');
				$('#cartbtncatalog').removeClass('hidecartbtn');				
			}	
        }

        BX.onCustomEvent('OnBasketChange');
    }
    
}









//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// +/- товары в корзине

// check if quantity is valid
// and update values of both controls (text input field for PC and mobile quantity select) simultaneously
function updateQuantity(controlId, basketId, ratio, bUseFloatQuantity)
{
    var oldVal = BX(controlId).defaultValue,
        newVal = parseFloat(BX(controlId).value) || 0,
        bIsCorrectQuantityForRatio = false,
        autoCalculate = ((BX("auto_calculation") && BX("auto_calculation").value == "Y") || !BX("auto_calculation"));

//console.log( 'autoCalculate', autoCalculate);

    if (ratio === 0 || ratio == 1)
    {
        bIsCorrectQuantityForRatio = true;
    } else
    {

        var newValInt = newVal * 10000,
                ratioInt = ratio * 10000,
                reminder = newValInt % ratioInt,
                newValRound = parseInt(newVal);

        if (reminder === 0)
        {
            bIsCorrectQuantityForRatio = true;
        }
    }

    var bIsQuantityFloat = false;

    if (parseInt(newVal) != parseFloat(newVal))
    {
        bIsQuantityFloat = true;
    }

    newVal = (bUseFloatQuantity === false && bIsQuantityFloat === false) ? parseInt(newVal) : parseFloat(newVal).toFixed(4);
    newVal = correctQuantity(newVal);

    if (bIsCorrectQuantityForRatio)
    {
        BX(controlId).defaultValue = newVal;

        BX("QUANTITY_INPUT_" + basketId).value = newVal +  $("#QUANTITY_INPUT_" + basketId).data('desc');

        // set hidden real quantity value (will be used in actual calculation)
        BX("QUANTITY_" + basketId).value = newVal;

        if (autoCalculate)
        {
            basketPoolQuantity.changeQuantity(basketId);
        }
    } else
    {
        newVal = getCorrectRatioQuantity(newVal, ratio, bUseFloatQuantity);
        newVal = correctQuantity(newVal);

        if (newVal != oldVal)
        {
            BX("QUANTITY_INPUT_" + basketId).value = newVal +  $("#QUANTITY_INPUT_" + basketId).data('desc');
            BX("QUANTITY_" + basketId).value = newVal;

            if (autoCalculate)
            {
                basketPoolQuantity.changeQuantity(basketId);
            }
        } else
        {
            BX(controlId).value = oldVal;
        }
    }
}

(function () {
    $(document).on('click', '.select-number-btn-plus', function (event) {
        t = $(this).parent().children("label").children("input");
        var multiplacity = t.attr("multiplicity");
        var basketId = t.data("id");
        var quantityMax = $(this).parent().children(".select-number-input").data('max');
        if(t.is(':checked'))
        {
            setQuantity(basketId,parseInt(multiplacity),'up','',quantityMax);
        }
        else
        {
            setQuantity(basketId,1,'up','',quantityMax);
        }
    });
    $(document).on('click', '.select-number-btn-minus', function (event) {
        t = $(this).parent().children("label").children("input");
        var multiplacity = t.attr("multiplicity");
        var basketId = t.data("id");
        var quantityMax = $(this).parent().children(".select-number-input").data('max');
        if(t.is(':checked'))
        {
            setQuantity(basketId,parseInt(multiplacity),'down','',quantityMax);
        }
        else
        {
            setQuantity(basketId,1,'down','',quantityMax);
        }
    });
    $(document).on('change', '.select-number-input', function (event) {
        var currentVal = parseInt($(this).val());
        var quantityMax = $(this).data('max');
        //console.log(quantityMax);
        var multiplicity = parseInt($(this).parent().children("label").children(".multiplicity").attr("multiplicity"));
        var edenica = $(this).attr('data-desc');
        var newVal = 0;
        if ($(this).parent().children("label").children(".multiplicity").is(':checked')){
            if(currentVal % multiplicity === 0)
            {
            newVal = currentVal;
            }
            else
            {
            var del = currentVal/multiplicity;
            newVal = (parseInt(del) + 1) * multiplicity;
            }
            var newMultiplicity = newVal - currentVal;
            /*if(newMultiplicity > quantityMax)
                newMultiplicity = quantityMax;*/
            var basketId = $(this).parent().children("label").children(".multiplicity").data('id');
            setQuantity(basketId,0,'up','',quantityMax);
        }
        else
        {
            /*if(currentVal > quantityMax)
                currentVal = quantityMax;*/
           
            var basketId = $(this).parent().children("label").children(".multiplicity").data('id');
            setQuantity(basketId,0,'up','',quantityMax);
        }
    });
    $(document).on('change', '.label-multiplicity', function (event) {
        var currentVal = parseInt($(this).parent().children(".select-number-input").val());
        var multiplicity = parseInt($(this).children(".multiplicity").attr('multiplicity'));
        var quantityMax = $(this).parent().children(".select-number-input").data('max');
        var newVal = 0;
        if ($(this).children(".multiplicity").is(':checked')){
            
          if(currentVal % multiplicity === 0)
          {
            newVal = currentVal;
          }
          else
          {
            var del = currentVal/multiplicity;
            newVal = (parseInt(del) + 1) * multiplicity;
          }
          var newMultiplicity = newVal - currentVal;
          var basketId = $(this).children(".multiplicity").data('id');
          setQuantity(basketId,parseInt(newMultiplicity),'up','',quantityMax);
        }
    });
    })();


// used when quantity is changed by clicking on arrows
function setQuantity(basketId, ratio, sign, bUseFloatQuantity)
{
    var curVal = parseFloat(BX("QUANTITY_INPUT_" + basketId).value),
            newVal;

    newVal = (sign == 'up') ? curVal + ratio : curVal - ratio;

    if (newVal < 0)
        newVal = 0;

    if (bUseFloatQuantity)
    {
        newVal = parseFloat(newVal).toFixed(4);
    }
    newVal = correctQuantity(newVal);

    if (ratio > 0 && newVal < ratio)
    {
        newVal = ratio;
    }

    if (!bUseFloatQuantity && newVal != newVal.toFixed(4))
    {
        newVal = parseFloat(newVal).toFixed(4);
    }

    newVal = getCorrectRatioQuantity(newVal, ratio, bUseFloatQuantity);
    newVal = correctQuantity(newVal);

    BX("QUANTITY_INPUT_" + basketId).value = newVal + $("#QUANTITY_INPUT_" + basketId).data('desc');;
    BX("QUANTITY_INPUT_" + basketId).defaultValue = newVal;

    updateQuantity('QUANTITY_INPUT_' + basketId, basketId, ratio, bUseFloatQuantity);
}

function getCorrectRatioQuantity(quantity, ratio, bUseFloatQuantity)
{
    var newValInt = quantity * 10000,
            ratioInt = ratio * 10000,
            reminder = (quantity / ratio - ((quantity / ratio).toFixed(0))).toFixed(6),
            result = quantity,
            bIsQuantityFloat = false,
            i;
    ratio = parseFloat(ratio);

    if (reminder == 0)
    {
        return result;
    }

    if (ratio !== 0 && ratio != 1)
    {
        for (i = ratio, max = parseFloat(quantity) + parseFloat(ratio); i <= max; i = parseFloat(parseFloat(i) + parseFloat(ratio)).toFixed(4))
        {
            result = i;
        }

    } else if (ratio === 1)
    {
        result = quantity | 0;
    }

    if (parseInt(result, 10) != parseFloat(result))
    {
        bIsQuantityFloat = true;
    }

    result = (bUseFloatQuantity === false && bIsQuantityFloat === false) ? parseInt(result, 10) : parseFloat(result).toFixed(4);
    result = correctQuantity(result);
    return result;
}

function correctQuantity(quantity)
{
    return parseFloat((quantity * 1).toString());
}






//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//купоны

/**
 * @param couponBlock
 * @param {COUPON: string, JS_STATUS: string} oneCoupon - new coupon.
 */
function couponCreate(couponBlock, oneCoupon)
{
    var couponClass = 'disabled';

    if (!BX.type.isElementNode(couponBlock))
        return;
    if (oneCoupon.JS_STATUS === 'BAD')
        couponClass = 'bad';
    else if (oneCoupon.JS_STATUS === 'APPLYED')
        couponClass = 'good';

    couponBlock.appendChild(BX.create(
            'div',
            {
                props: {
                    className: 'bx_ordercart_coupon'
                },
                children: [
                    BX.create(
                            'input',
                            {
                                props: {
                                    className: couponClass,
                                    type: 'text',
                                    value: oneCoupon.COUPON,
                                    name: 'OLD_COUPON[]'
                                },
                                attrs: {
                                    disabled: true,
                                    readonly: true
                                }
                            }
                    ),
                    BX.create(
                            'span',
                            {
                                props: {
                                    className: couponClass
                                },
                                attrs: {
                                    'data-coupon': oneCoupon.COUPON
                                }
                            }
                    ),
                    BX.create(
                            'div',
                            {
                                props: {
                                    className: 'bx_ordercart_coupon_notes'
                                },
                                html: oneCoupon.JS_CHECK_CODE
                            }
                    )
                ]
            }
    ));
}

/**
 * @param {COUPON_LIST : []} res
 */
function couponListUpdate(res)
{
    var couponBlock,
            couponClass,
            fieldCoupon,
            couponsCollection,
            couponFound,
            i,
            j,
            key;

    if (!!res && typeof res !== 'object')
    {
        return;
    }

    couponBlock = BX('coupons_block');
    if (!!couponBlock)
    {
        if (!!res.COUPON_LIST && BX.type.isArray(res.COUPON_LIST))
        {
            fieldCoupon = BX('coupon');
            if (!!fieldCoupon)
            {
                fieldCoupon.value = '';
            }
            couponsCollection = BX.findChildren(couponBlock, {tagName: 'input', property: {name: 'OLD_COUPON[]'}}, true);

            if (!!couponsCollection)
            {
                if (BX.type.isElementNode(couponsCollection))
                {
                    couponsCollection = [couponsCollection];
                }
                for (i = 0; i < res.COUPON_LIST.length; i++)
                {
                    couponFound = false;
                    key = -1;
                    for (j = 0; j < couponsCollection.length; j++)
                    {
                        if (couponsCollection[j].value === res.COUPON_LIST[i].COUPON)
                        {
                            couponFound = true;
                            key = j;
                            couponsCollection[j].couponUpdate = true;
                            break;
                        }
                    }
                    if (couponFound)
                    {
                        couponClass = 'disabled';
                        if (res.COUPON_LIST[i].JS_STATUS === 'BAD')
                            couponClass = 'bad';
                        else if (res.COUPON_LIST[i].JS_STATUS === 'APPLYED')
                            couponClass = 'good';

                        BX.adjust(couponsCollection[key], {props: {className: couponClass}});
                        BX.adjust(couponsCollection[key].nextSibling, {props: {className: couponClass}});
                        BX.adjust(couponsCollection[key].nextSibling.nextSibling, {html: res.COUPON_LIST[i].JS_CHECK_CODE});
                    } else
                    {
                        couponCreate(couponBlock, res.COUPON_LIST[i]);
                    }
                }
                for (j = 0; j < couponsCollection.length; j++)
                {
                    if (typeof (couponsCollection[j].couponUpdate) === 'undefined' || !couponsCollection[j].couponUpdate)
                    {
                        BX.remove(couponsCollection[j].parentNode);
                        couponsCollection[j] = null;
                    } else
                    {
                        couponsCollection[j].couponUpdate = null;
                    }
                }
            } else
            {
                for (i = 0; i < res.COUPON_LIST.length; i++)
                {
                    couponCreate(couponBlock, res.COUPON_LIST[i]);
                }
            }
        }
    }
    couponBlock = null;
}

function deleteCoupon()
{
    var target = this,
            value;

    if (BX.type.isElementNode(target) && target.hasAttribute('data-coupon'))
    {
        value = target.getAttribute('data-coupon');
        if (BX.type.isNotEmptyString(value))
        {
            recalcBasketAjax({'delete_coupon': value});
        }
    }
}

function enterCoupon()
{
    var newCoupon = BX('coupon');
    if (!!newCoupon && !!newCoupon.value)
        recalcBasketAjax({'coupon': newCoupon.value});
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~






/* modal-fast-buy-open */
function basket_one_click() {

    $.ajax({
            method: 'GET',
            url: '/ajax/form_basket_oneclick.php',
            data: { 'action': 'get_form' }
    }).done(function( answer ) {
        $('#modal-fast-buy .modal-title').html('Оформить заказ 1 клик');
        $('.modal-fast-buy-body').html(answer);
        $('.modal-fast-buy-body [type="tel"]').mask('+7 (999) 999-99-99');
        openModal('#modal-fast-buy');
    });
    return false;
}







//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
BX.ready(function () {

    basketPoolQuantity = new BasketPoolQuantity();
    var couponBlock = BX('coupons_block'),
            basketItems = get_BasketItems();// BX('basket_items');


    if (BX.type.isElementNode(couponBlock))
        BX.bindDelegate(couponBlock, 'click', {'attribute': 'data-coupon'}, deleteCoupon);

    if (BX.type.isNotEmptyString(basketJSParams['EVENT_ONCHANGE_ON_START']) && basketJSParams['EVENT_ONCHANGE_ON_START'] == "Y")
        BX.onCustomEvent('OnBasketChange');
});

