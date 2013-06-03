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
                type: 'radio',
                options: [5, 15, 510, 50],
                answer: '510'
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
                answer: 'false'
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
        },
        tabs = ['<li>\
                  <p>Unesite vas e-mail</p>\
                  <input type="text" class="email" placeholder="E-mail"/>\
                  <a class="btn startQuizApp"  href="#">Start<i class="icon-arrow-right"></i></a>\
                </li>\
                '],
        activeTab = 0;



    QuizApp.init = function () {
        this.result = 0;
        this.questions_no = _.size(Questions);
        this.test = console.log(this);
        for ( var prop in Questions) {
            tabs.push(this.getPanelHTML(Questions[prop], prop, Questions.length));
        }
        tabs.push('<li>\
                    <p class="odgovori">Odgovori:</p>\
                    <a class="btn repeat"  href="#">Ponovi Kviz<i class="icon-repeat"></i></a>\
                </li>');
        this.showTab(activeTab);
        QuizApp.changeTab();
    };

    QuizApp.getPanelHTML = function (data, prop, len) {

        return '<li>\
                    <small>Question: ' + prop + '</small>\
                    <p>' + data.question + '</p>\
                    <div class="questions">'+this.getInputHTML(data, prop)+'</div>\
                    <a class="btn next_btn" href="#">next<i class="icon-arrow-right"></i></a>\
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
        $('.QuizApp').html(tabs[activeTab]);
        //fix, poziv da na novoispisani html aktivira click evente.
        this.changeTab();
    };

    QuizApp.changeTab = function () {
        $('.startQuizApp').on('click', function() {
            activeTab++;
            QuizApp.showTab(activeTab);

        });

        // Razlika izmedju prev i next je samo u ++ i --
        // mozda bi mogao da to nekako drugacije napises - da imas samo jednu funckiju, hmm ?
        $('.next_btn').on('click', function() {
            if (QuizApp.validate()) {
                activeTab++;
                QuizApp.showTab(activeTab);
            } else {
                // Ovo bi moglo u validaciju da ide, zar ne?
                // Izgubis taman taj else
                $('.alert').remove();
                $('<p class="alert alert-error">Please select some answer</p>').insertAfter('.questions');
            }
        });
        $('.back_btn').on('click', function() {
            activeTab--;
            QuizApp.showTab(activeTab);
        });
    };

    QuizApp.validate = function (index) {
        var isSelected = $('.QuizApp').find('input').is(':checked'),
            inputText = $('.QuizApp').find('input[type="text"]').val();

        return isSelected || inputText;
    };

    $(window.document).ready($.proxy(QuizApp.init, QuizApp));
}(window, jQuery, _, QuizApp));
