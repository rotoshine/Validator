(function(global){
    /**
     * 값 검증을 위한 객체.<br/>
     * method chain 형식으로 구현되어있다.<br/>
     * 검증할 메소드를 method chain 형식으로 호출한 뒤, 최종적으로
     * run을 호출하면 실제검증을 수행하고 검증결과를 반환한다.<br/>
     * ex) var valid = new Validator();<br/>
     *     valid.isNotEmpty($("#target").val(), "대상이 비었습니다")<br/>
     *          .isNotEmpty($("#target2").val(), "대상이 비었습니다")<br/>
     *          .isEqual(user.password, user.password2, "비밀번호가 같지 않습니다.")<br/>
     *          .is(user.name.length > 1, "이름이 너무 짧습니다.")<br/>
     *          .run();<br/>
     * @class Validator
     * @param options.onlyFirstMessageNotify true인 경우, 에러 메시지가 여러개여도 최초의 메시지만 notify 된다. 기본값 true
     * @param options.notifier 에러 메시지를 notify할 함수. 기본동작은 alert함수.
     * @constructor
     */
    var Validator = function(options){
        var that = this;
        var addErrorMessageAndValidFalse = function(failMessage){
            if(failMessage){
                that.failMessageList.push(failMessage);
            }
            that.isValid = false;
        };

        var defaultNotifier = function(failMessage){
            alert(failMessage);
        };

        if(!options){
            options = {};
        }

        /**
         * @property isValid 검증 성공 여부.<br/>
         * 검증이 1개라도 실패했다면 해당 값은 false로 바뀐다.
         * @type {Boolean}
         */
        this.isValid = true;

        /**
         * @property validCount 검증이 일어난 횟수
         * @type {Number}
         */
        this.validCount = 0;

        /**
         * @property failmessageList 검증 실패 메시지를 담아둔 Array
         * @type {Array}
         */
        this.failMessageList = [];

        /**
         * @property onlyFirstMessageNotify 첫번째 메시지만 notify할지 여부
         * @type {Boolean}
         */
        this.onlyFirstMessageNotify = options.onlyFirstMessageNotify || true;

        /**
         * @property notifier 검증 알림에 사용할 함수
         * @type {Function}
         */
        this.notifier = options.notifier || defaultNotifier;

        /**
         * condition이 false인지 체크한다.<br/>
         * condition에 함수를 넘길경우 해당 함수를 실행하며,
         * 해당 함수는 실행결과값으로 true 혹은 false를 리턴해야 한다.<br/>
         * condition의 값이 false거나 실행결과가 false인 경우 검증 실패처리한다.
         * @method is
         * @param conditionOrFunction 검증 조건 혹은 검증을 실행할 function
         * @param failMessage 검증 실패 시 추가될 메시지
         * @returns {Validator}
         */
        this.is = function(conditionOrFunction, failMessage){
            that.validCount++;
            var condition;

            // condition에 function이 넘어온 경우 해당 function을 실행하고 결과값을 얻음
            if(typeof conditionOrFunction === "function"){
                condition = conditionOrFunction();
            }else{
                condition = conditionOrFunction;
            }


            if(!condition){
                addErrorMessageAndValidFalse(failMessage);
            }
            return that;
        };

        /**
         * value의 값이 비어있지 않은지 체크한다.
         * @method isNotEmpty
         * @param value 비어있는지 여부를 체크할 값
         * @param failMessage 검증 실패 시 추가될 메시지
         * @returns {Validator}
         */
        this.isNotEmpty = function(value, failMessage){
            return that.is(value && value !== "", failMessage);
        };

        /**
         * a와 b가 같은지 체크한다.<br/>
         * === 를 이용해 비교하므로, true와 'true'는 같지 않다고 판단한다.
         * @method equals
         * @param a
         * @param b
         * @param failMessage
         * @returns {Validator}
         */
        this.equals = function(a, b, failMessage){
            return that.is(a === b, failMessage);
        };

        /**
         * a와 b가 같지 않은지 체크한다.
         * @param a
         * @param b
         * @param failMessage
         * @method notEquals
         * @returns {Validator}
         */
        this.notEquals = function(a, b, failMessage){
            return that.is(a !== b, failMessage);
        };

        /**
         * 검증 결과를 실행한다.<br/>
         * 만일 검증 결과가 false인 경우
         * 설정된 notifier를 실행한다.
         * run 호출 이후 method chaining은 종료되며, 검증결과를 반환한다.
         * @method run
         * @returns {Boolean}
         */
        this.run = function(){
            var notifyCount;
            var i;
            if(!that.isValid && that.failMessageList.length > 0){
                if(that.onlyFirstMessageNotify){
                    notifyCount = 1;

                }else{
                    notifyCount = that.failMessageList.length;
                }
                for( i = 0 ; i < notifyCount; i++){
                    that.notifier(that.failMessageList[i]);
                }
            }

            return that.isValid;
        };
    };
    if(global.exports){
        global.exports = Validator;
    }else if(window && window.define && typeof window.define === "function"){
        window.define(function(){
            return Validator;
        });
    }else{
        window.Validator = Validator;
    }
})(window || global);
