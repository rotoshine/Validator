(function(Validator){
    "use strict";
    describe("Validator Spec", function(){
        it("default notifier가 설정되어 있다면 run 호출 시 에러 메시지가 alert으로 실행되어야 한다.", function(){
            // alert mocking
            spyOn(window, "alert").andCallFake(function(){});
            var validator = new Validator();

            // error 강제 설정
            validator.is(false, "에러").run();
            expect(window.alert).toHaveBeenCalled();
        }); 
        it("is 함수 호출 시 false를 넘기면 validation 결과가 false가 되어야 한다.", function(){
            var validator = new Validator();
            expect(validator.isValid).toBeTruthy();
            validator.is(true);
            expect(validator.isValid).toBeTruthy();
            validator.is(false);
            expect(validator.isValid).toBeFalsy();
        });
        it("한 번이라도 검증이 실패하면 그 후에 검증이 성공해도 검증결과는 실패여야한다.", function(){
            var validator = new Validator();

            // 실패하는 검증
            validator
                .is(false)
                .is(false)
                .is(true)
                .run();
            expect(validator.isValid).toBeFalsy();
        });
        it("검증 실패 시 해당 내용에 대한 메시지를 파라메터로 넘길 경우 에러메시지 목록에 추가되어야 한다.", function(){
            var failMessage1 = "실패 메시지1";
            var failMessage2 = "실패 메시지2";

            var validator = new Validator();
            validator
                .is(false, failMessage1)
                .is(false, failMessage2)
                .is(true, "성공 메시지")

            expect(validator.failMessageList.length).toEqual(2);
            expect(validator.failMessageList[0]).toEqual(failMessage1);
            expect(validator.failMessageList[1]).toEqual(failMessage2);
        });

        it("equal은 파라메터로 받은 두가지 객체의 값과 타입이 동잏해야만 검증을 통과한다.", function(){
            expect(new Validator().equals(1, 1).run()).toBeTruthy();
            expect(new Validator().equals("A", "A").run()).toBeTruthy();
            expect(new Validator().equals(1, "1").run()).toBeFalsy();
        });

        it("notEquals는 파라메터로 받은 두가지 객체의 값과 타입이 동일하지 않아야만 검증을 통과한다.", function(){
            expect(new Validator().notEquals("A", "B").run()).toBeTruthy();
            expect(new Validator().notEquals("1", 1).run()).toBeTruthy();
            expect(new Validator().notEquals(1, 1).run()).toBeFalsy();
        });

        it("isNotEmpty는 value의 값이 빈 값이 아니여야만 검증을 통과한다.", function(){
            expect(new Validator().isNotEmpty("값").run()).toBeTruthy();
            expect(new Validator().isNotEmpty(undefined).run()).toBeFalsy();
            expect(new Validator().isNotEmpty("").run()).toBeFalsy();
        });

        it("is의 검증 대상으로 함수를 넘길경우 해당 함수가 실행되며 해당 함수의 결과값을 검증에 사용한다.", function(){
            expect(new Validator().is(function(){
                return true;
            }).run()).toBeTruthy();

            expect(new Validator().is(function(){
                return false;
            }).run()).toBeFalsy();
        });
    });
})(Validator)
