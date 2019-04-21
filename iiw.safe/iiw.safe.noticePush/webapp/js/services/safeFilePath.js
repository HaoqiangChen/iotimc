/**
 * 统一返回文件路径服务。
 *
 * Created by chq on 2019-11-13.
 */
define([
  'app'
], function (app) {
  app.factory('safeFilePath', ['iAjax', '$timeout', function (iAjax, $timeout) {
    var safeFilePath;

    safeFilePath = {
      getFileNameByPath: function (path) {
        var index = path.lastIndexOf('/'); // lastIndexOf("/")  找到最后一个  /  的位置
        var fileName = path.substr(index + 1); // substr() 截取剩余的字符，即得文件名xxx.doc

        return fileName;
      },

      /*
       * 已知文件路径，获取文件类型doc
       */
      getFileTypeByPath: function (path) {
        var index = path.lastIndexOf('.');
        var fileType = path.substr(index + 1); // substr() 截取剩余的字符，即文件名doc

        return fileType;
      },
      /*
       * 已知文件路径，获取文件后缀.doc
       */
      getFileExtensionByPath: function (path) {
        var index1 = path.lastIndexOf('.');
        var index2 = path.length;
        var fileExtension = path.substr(index1, index2); // substr() 截取剩余的字符，即文件名.doc

        return fileExtension;
      },

      /*
       * 已知文件路径，获取文件类型doc之后返回相应 icon样式
       */
      getFileIconByType: function (path) {
        var type = this.getFileTypeByPath(path);
        if (type === 'jpg' || type === 'png' || type === 'jpeg') return 'fa-file-image-o';
        else if (type === 'mp3' || type === 'acc' || type === 'ogg' || type === 'wav') return 'fa-file-audio-o';
        else if (type === 'mp4' || type === 'avi' || type === 'rmvb') return 'fa-file-video-o';
        else if (type === 'zip' || type === 'rar' || type === '7z') return 'fa-file-zip-o';
        else if (type === 'word') return 'fa-file-word-o';
        else if (type === 'excel') return 'fa-file-excel-o';
        else if (type === 'pdf') return 'fa-file-pdf-o';
        else if (type === 'ppt') return 'fa-file-powerpoint-o';
        else if (type === 'txt') return 'fa-file-text-o';
        else return 'fa-file';
      }

    };

    return safeFilePath;
  }]);
});
