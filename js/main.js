window.QuizApp || (window.QuizApp = {});
(function(window, $, _, QuizApp, undefined) {
    var Questions = {
            1: {
                question: 'var x="5", y="10"; <br /> console.log(x+y);',
                type: 'text',
                options: '',
                answer: '510'
            },
            2: {
                question: 'var x=5, y=10; <br />console.log(x+y);',
                type: 'text',
                options: '',
                answer: '15'
            },
            3: {
                question: 'var x=5, y="10"; <br />console.log(x+y);',
                type: 'radio',
                options: [5, 15, 510, 50],
                answer: '510'
            },
            4: {
                question: 'var x="5", y=10; <br /> console.log(+x+y);',
                type: 'checkbox',
                options: [5, 15, 510, 50],
                answer: '15'
            },
            5: {
                question: '(function() { <br /> var kittySays = "Meow";})();<br /> console.log(kittySays);',
                type: 'radio',
                options: ['Meow', 'Error'],
                answer: 'Error'
            },
            6: {
                question: '(function() {<br />kittySays = "Meow";})();<br />console.log(kittySays);',
                type: 'radio',
                options: ['Meow', 'Error'],
                answer: 'Meow'
            },
            7: {
                question: 'function foo() {<br />kittySays = "Meow";})();<br />console.log(kittySays);',
                type: 'radio',
                options: ['Meow', 'Error'],
                answer: 'Error'
            },
            8: {
                question: 'var x = 15, y = 10; <br />console.log(x+++y);',
                type: 'radio',
                options: [5, 20, 4, 25],
                answer: '25'
            },
            9: {
                question: 'var x = 15, y = 10; <br />console.log(x++-++y);',
                type: 'radio',
                options: [5, 20, 4, 30],
                answer: '4'
            },
            10: {
                question: 'var x = 15, y = 10; <br />console.log(x++-++y+x++);',
                type: 'radio',
                options: [20, 25, 4, 10],
                answer: '20'
            },
            11: {
                question: 'var x = "99", y="101"; <br />console.log (x < y);',
                type: 'radio',
                options: ['true', 'false', 'undefined', 'null'],
                answer: 'false'
            },
            12: {
                question: 'var x = "99", y="101"; <br />console.log (x < +y);',
                type: 'radio',
                options: ['true', 'false', 'undefined', 'null'],
                answer: 'true'
            },
            13: {
                question: 'var x = "99", y=101; <br />console.log (x < y);',
                type: 'radio',
                options: ['true', 'false', 'undefined', 'null'],
                answer: 'true'
            }
        };
        //za sad su izbaceni napolje jer mi uvek loguje undefined kad ih koristim u nekoj funkciji
        //a ako ih koristim u funkciji kao this.score (npr.) onda kreira nov koji bude undefined ponovo i poebe se

    QuizApp.init = function () {
        this.questions_no = _.size(Questions);
        this.result = {};
        this.score = 0;
        this.email = '';
        this.activeTab = 0;
        this.tabs = ['<li>\
                  <p>Unesite vas e-mail</p>\
                  <input type="text" class="email" placeholder="E-mail"/>\
                  <a class="btn startQuizApp"  href="#">Start<i class="icon-arrow-right"></i></a>\
                </li>\
                '];

        for ( var prop in Questions) {
            this.tabs.push(this.getPanelHTML(Questions[prop], prop));
        }
        this.tabs.push('<li>\
                    <p class="odgovori">Odgovori:</p>\
                    <a class="btn repeat"  href="#">Ponovi Kviz<i class="icon-repeat"></i></a>\
                </li>');
        this.showTab(this.activeTab);
    };

    QuizApp.getPanelHTML = function (data, prop) {
        var lastQuestion = 'next_btn';

        if ( +prop === this.questions_no ) {
            lastQuestion = 'finish';
        }
        return '<li>\
                    <small>Question: ' + prop + '/' +this.questions_no+ '</small>\
                    <p>' + data.question + '</p>\
                    <div class="questions">'+this.getInputHTML(data, prop)+'</div>\
                    <a class="btn ' +lastQuestion+'" href="#">next<i class="icon-arrow-right"></i></a>\
                    <a class="btn back_btn" href="#"><i class="icon-arrow-left"></i>back</a>\
                </li>';
    };

    QuizApp.getInputHTML = function (data, prop) {
        var dataType = data.type.toLowerCase(),
            i = 0;
        if (dataType === 'text') {
            return '<input type="text" placeholder="Type the answer"/>';
        } else {
            var optionsLenght = data.options.length,
                print = '';
            for (; i < optionsLenght; i++) {
                print += '<label><input type="' +dataType+ '" name="' +prop+ '" value="' +data.options[i]+ '" />' +data.options[i]+ '</label>';
            }
            return print;
        }
    };

    QuizApp.showTab = function (index) {
        $('.QuizApp').html(this.tabs[index]);
        //fix, poziv da na novoispisani html aktivira click evente.
        this.changeTab();
    };

    QuizApp.showResult = function (res) {
        var checkScore = 0,
            falseAns = 0,
            print = '',
            self = this;

        for ( var prop in res) {
            var ansersLength = res[prop].multipleAnswer.length,
                i = 0;
            if (ansersLength === 1) {
                if (res[prop].correct) {
                    checkScore++;
                    print += '<p class="btn btn-success"><i class="icon-ok"></i>' +prop+ ': ' +res[prop].multipleAnswer+ '</p>';
                } else {
                    checkScore--;
                    print += '<div class="wrongAHolder"><p class="btn btn-danger"><i class="icon-remove"></i>' +prop+ ': ' +res[prop].multipleAnswer+ '</p><p class="correctA">Correct answer is: ' +Questions[prop].answer+ '  </p> </div>';
                }
            } else {
                for (; i < ansersLength; i++){
                    if (res[prop].multipleAnswer[i] === Questions[prop].answer) {
                        checkScore++;
                        print += '<p class="btn btn-success"><i class="icon-ok"></i>' +prop+ ': ' +res[prop].multipleAnswer[i]+ '</p>';
                    }
                    else {
                        checkScore--;
                        print += '<div class="wrongAHolder"><p class="btn btn-danger"><i class="icon-remove"></i>' +prop+ ': ' +res[prop].multipleAnswer[i]+ '</p><p class="correctA">Correct answer is: ' +Questions[prop].answer+ '  </p> </div>';
                    }           
                }

            }
        }
        this.score = parseFloat(Math.round((checkScore * 100/this.questions_no) * 100) / 100).toFixed(2); ;
        $('<p class="score">Rezultat testa koji je osvojio ' +this.email+ ' je: ' +this.score+ '%</p><div class="ansers" />').insertAfter('.odgovori');
        $('.ansers').html(print);

        $('.wrongAHolder').hover(function() {
            $(this).find('.correctA').show();
        }, function() {
            $(this).find('.correctA').hide();
        });
        $('.repeat').on('click', function() {
            self.init();
        })
    };

    QuizApp.checkAnswer = function (answer, tab) {
        var len = answer.length,
            i = 0,
            pera = [],
            isCorrect = false;

        if ( len === 1 ) {
            this.result[tab] = {
                correct: answer[0] === Questions[tab].answer,
                multipleAnswer: answer
            }
        } else {
            for(; i < len; i++) {
                if(answer[i] === Questions[tab].answer) {
                    isCorrect = true;
                }
            }
            this.result[tab] = {
                correct: isCorrect,
                multipleAnswer: answer
            }
        }
        //return isCorrect;
    };

    QuizApp.changeTab = function () {
        var self = this;

        $('.startQuizApp').on('click', function() {
            self.activeTab = 1;
            self.email = $('.email').val();
            if (self.validateEmail(self.email)) {
                self.showTab(self.activeTab);
            }
            
        });

        // Razlika izmedju prev i next je samo u ++ i --
        // mozda bi mogao da to nekako drugacije napises - da imas samo jednu funckiju, hmm ?
        $('.next_btn').on('click', function() {
            if (self.validate(self.activeTab)) {
                self.activeTab++;
                self.showTab(self.activeTab);
            }
        });
        $('.back_btn').on('click', function() {
            self.activeTab--;
            //self.result--;
            self.showTab(self.activeTab);
        });
        $('.finish').on('click', function() {
            if (self.validate(self.activeTab)) {
                self.activeTab++;
                self.showTab(self.activeTab);
                self.showResult(self.result);
            }
        });
    };

    QuizApp.validate = function (index) {
        var isSelected = $('.QuizApp').find('input').is(':checked'),
            selectedVal = [],
            inputText = $.trim($('.QuizApp').find('input[type="text"]').val());

         $('.QuizApp').find('input:checked').each(function() {
            selectedVal.push($(this).val());
        });

        if (isSelected) {
            //activeTab  prosledjujemo da bi znali iz objekta koji tacan odgovor da poredimo
            this.checkAnswer(selectedVal, index);
            return true;
        } else if (inputText) {
            selectedVal.push(inputText);
            this.checkAnswer(selectedVal, index);
            return true;
        } else {
            $('.alert').remove();
            $('<p class="alert alert-error">Please select/write some answer</p>').insertAfter('.questions');
            return false;
        }
    };

    QuizApp.validateEmail = function (email) {
        var rEmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            isValid = rEmailPattern.test($.trim(email));

        if (!isValid) {
            $('.alert').remove();
            $('<p class="alert alert-error">Please enter a valid email</p>').insertBefore('.email');
        }
        return isValid;
    };

    $(window.document).ready($.proxy(QuizApp.init, QuizApp));
}(window, jQuery, _, QuizApp));
