


$(function () {
    "use strict";

    $(document).ready(function () {
        loadForm();
        validateForm();


        $('#frmCheckValidateForm').submit(function () {
            $("#total").css("opacity", "0");
            var datackeditor = getDataFromTheEditor();
            if (datackeditor != null && datackeditor != "") {
                $("#editor-val").hide();

            } else {
                $("#editor-val").removeClass("dpnone");
                $("#editor-val").show();
                $(".editor-val").parents(".control-group").addClass("validate-error");

                return false;
            }
            $("#editor").val(datackeditor);

            $(this).ajaxSubmit(options);
            return false;
        });
        var options = {
            beforeSubmit: showRequest,
            success: function (data) {
                showResponse(data);
            },
            /*resetForm: true*/
        };

        function showRequest(arr, $form, options) {

            var datackeditor = getDataFromTheEditor(); //ck editor data

            var m,
                urls = [],
                rex = /<img[^>]+src="?([^"\s]+)"?\s*[^>]+\>/g;

            while (m = rex.exec(datackeditor)) {
                urls.push(m[1]);
            }

            var n,
                alts = [],
                rexalt = /<img .*?alt="(.*?)".*?>/g;

            while (n = rexalt.exec(datackeditor)) {
                alts.push(n[1]);
            }

            var h,
                hrefs = [],
                rexhref = /href="([^\'\"]+)/g;

            while (h = rexhref.exec(datackeditor)) {
                hrefs.push(h[1]);
            }

            if (urls != null && urls.length != 0) {
                for (var i = 0; i < urls.length; i++) {
                    arr.push({ name: 'ListSrcBaiViet', value: urls[i] });
                }

            }

            if (alts != null && alts.length != 0) {
                for (var i = 0; i < alts.length; i++) {
                    arr.push({ name: 'ListAltBaiViet', value: alts[i] });
                }

            }

            if (hrefs != null && hrefs.length != 0) {
                for (var i = 0; i < hrefs.length; i++) {
                    arr.push({ name: 'ListHrefBaiViet', value: hrefs[i] });
                }
            }

            if (datackeditor) {
                $("#contentck").html(datackeditor);
                var node = document.getElementById('contentck');
                arr.push({ name: 'BaiVietText', value: node.textContent });
            }

        }
        function showResponse(data) {
            if (data.success != true) {
                return false;
            } else {
                $(".respon-search").removeClass("d-none");
                $("#none-data").hide();
                $("#response-data").show();

                document.getElementById("total").innerHTML = data.total;

                setTimeout(function () {
                    switch (true) {
                        case data.total == 10: {
                            document.getElementById("comment").innerHTML = "Thưa ngài Master of SEO, ngài thật vô song!";
                            document.getElementById("point-img").src = "/image/2822340 1.png";
                            document.getElementById("point-group").style.color = "#2DCA88";
                            break;
                        }
                        case (8.5 <= data.total && data.total <= 9.5): {
                            document.getElementById("comment").innerHTML = "Thật tuyệt! Bạn là cây bút xuất sắc đó";
                            document.getElementById("point-img").src = "/image/9point.svg";
                            document.getElementById("point-group").style.color = "#2DCA88";
                            break;
                        }
                        case (5 <= data.total && data.total <= 8.25): {
                            document.getElementById("comment").innerHTML = "Ayoo, dành thời gian cải thiện thêm chút nữa nha";
                            document.getElementById("point-img").src = "/image/3063816 1.png";
                            document.getElementById("point-group").style.color = "#F2994A";
                            break;
                        }
                        case (2.25 <= data.total && data.total <= 4.75): {
                            document.getElementById("comment").innerHTML = "Úi, đừng publish bài viết này, hãy chỉnh sửa thêm";
                            document.getElementById("point-img").src = "/image/2763247.png";
                            document.getElementById("point-group").style.color = "#EB5757";
                            break;
                        }
                        case (data.total <= 2.25): {
                            document.getElementById("comment").innerHTML = "Ơ bạn ơi, viết lách như này có lỗi với tổ nghề đấy";
                            document.getElementById("point-img").src = "/image/5862878.png";
                            document.getElementById("point-group").style.color = "#EB5757";
                            break;
                        }
                        default: {
                            //console.log(data.total)
                        }
                    }
                    //dat
                    if (data.resultDat.length == 0) {
                        document.getElementById("dat").innerHTML = "";
                        $("#good").hide();

                    } else {
                        var nHTMLDat = '';
                        for (var i = 0; i < data.resultDat.length; i++) {
                            nHTMLDat += '<div><img src="/image/Ellipse 2.svg" alt="">' + data.resultDat[i].tieuDe + '</div>';
                        }
                        document.getElementById("dat").innerHTML = nHTMLDat;
                        $("#good").show();
                    }
                    //can cai thien
                    if (data.resultCanCaiThien.length == 0) {
                        document.getElementById("cancaithien").innerHTML = "";
                        $("#improve").hide();
                    } else {
                        var nHTMLCanCaithien = '';
                        for (var i = 0; i < data.resultCanCaiThien.length; i++) {
                            nHTMLCanCaithien += '<div><img src="/image/Ellipse 14.svg" alt="">' + data.resultCanCaiThien[i].tieuDe + '</div>';
                        }
                        document.getElementById("cancaithien").innerHTML = nHTMLCanCaithien;
                        $("#improve").show();
                    }
                    //chua dat
                    if (data.resultChuaDat.length == 0) {
                        document.getElementById("chuadat").innerHTML = "";
                        $("#bad").hide();
                    } else {
                        var nHTMLChuaDat = '';
                        for (var i = 0; i < data.resultChuaDat.length; i++) {
                            nHTMLChuaDat += '<div><img src="/image/Ellipse 16.svg" alt="">' + data.resultChuaDat[i].tieuDe + '</div>';
                        }
                        document.getElementById("chuadat").innerHTML = nHTMLChuaDat;
                        $("#bad").show();
                    }
                    $("#total").css("opacity", "1");
                }, 400);

            }

        }

    });

    function loadForm() {
        //$("#Url").val("https://resources.base.vn/hr/nhiem-vu-cua-hr-manager-trong-tuong-lai-488/");
        //$("#TuKhoaChinh").val("HR Manager");
        //$("#TuKhoaPhu").val("nhiệm vụ");
        //$("#TieuDe").val("HR Manager thực thụ có những nhiệm vụ gì trong công ty?");
        //$("#MoTa").val('HR manager sở hữu đa dạng nhiệm vụ liên quan đến nhân sự (tuyển dụng, đào tạo), chính sách, quyền lợi của từng cá thể trong công ty.');
        //$("#response-data").hide();
    }

    function validateForm() {

        $('#frmCheckValidateForm').validate({
            rules: {
                TieuDe: {
                    required: true
                },
                TuKhoaChinh: {
                    required: true
                },
                MoTa: {
                    required: true
                },
                BaiViet: {
                    required: true
                }

            },
            messages: {
                TieuDe: {
                    required: "Không được bỏ trống"
                },
                TuKhoaChinh: {
                    required: "Không được bỏ trống"
                },
                MoTa: {
                    required: "Không được bỏ trống"
                },
                BaiViet: {
                    required: "Không được bỏ trống"
                }

            },
            success: function (element) {
                element.addClass('valid')
                    .closest('.control-group').removeClass('error').addClass('success');
                $(element).parents("div.control-group").removeClass("validate-error");

            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents("div.control-group").addClass("validate-error");
            },
        });
    }


});

$(document).ready(function () {

    validateBlock("validate");

    $('input[name=TuKhoaChinh]').keyup(function () {
        var number = wordCount(this);
        document.getElementById("tkc").innerHTML = number + " từ";
    });
    $('input[name=TuKhoaPhu]').keyup(function () {
        var number = wordCount(this);
        document.getElementById("tkp").innerHTML = number + " từ";
    });
    $('input[name=TieuDe]').keyup(function () {
        var number = charactersCount(this);
        document.getElementById("tieude").innerHTML = number + " ký tự";
    });
    $('textarea[name=MoTa]').keyup(function () {
        var number = charactersCount(this);
        document.getElementById("mota").innerHTML = number + " ký tự";
    });
});
function charactersCount(field) {
    let number = 0;

    let str = $(field).val();

    if (str) {
        let str = $(field).val();
        number = str.trim().length;
    }
    return number;
}

function wordCount(field) {
    let number = 0;
    // Split the value of input by
    // space to count the words
    let matches = $(field).val().split(" ");
    // Count number of words
    number = matches.filter(function (word) {
        return word.length > 0;
    }).length;
    // Final number of words
    return number;
}

function validateBlock(type) {

    var check = true;
    var elementClass = $(".control-group ." + type);
    if (check) {

        for (let i = 0; i < elementClass.length; i++) {
            if ($(elementClass[i]).val() == null || $(elementClass[i]).val() == "") {

                check = false;
                break;
            }
        }
    }
    if (check) {
        var datackeditor = getDataFromTheEditor();

        if (datackeditor != null && datackeditor != "") {
            check = true;

        } else {
            check = false;
        }
    }

    if (check) {
        $('#check-btn').removeClass("disabled");

    }
    else {

        $("#check-btn").addClass("disabled");
    }



}