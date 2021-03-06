'use strict';
(function() {
  var lab = GameObjects.lab;
  var workers = GameObjects.workers;
  var research = GameObjects.research;
  var upgrades = GameObjects.upgrades;

  UI.validateVersion(lab.version);

  achievements.addResearch(research);
  achievements.addWorkers(workers);
  
  var app = angular.module('particleClicker', []);

  app.filter('niceNumber', ['$filter', function($filter) {
    if (!$filter ) { return $filter = {}; } else
    return Helpers.formatNumberPostfix;
  }]);

  app.filter('currency', ['$filter', function($filter) {
    return function(input) {
      return 'JTN ' + $filter('niceNumber')(input);
    };
  }]);

  app.filter('reverse', ['$filter', function($filter) {
    return function(items) {
      return items.slice().reverse();
    };
  }]);

  app.controller('DetectorController', function() {
    this.click = function() {
      lab.acquire(lab.detector.rate);
      detector.addEvent();
      achievements.update('count', 'clicks', 1);
      achievements.update('count', 'data', lab.detector.rate);
      UI.showUpdateValue("#update-data", lab.detector.rate);
      return false;
    };
  });

  app.controller('LabController', ['$interval', function($interval) {
    this.lab = lab;
    this.showDetectorInfo = function() {
      if (!this._detectorInfo) {
        this._detectorInfo = Helpers.loadFile('html/detector.html');
      }
      UI.showModal('Detektor', this._detectorInfo);
    };
    $interval(function() {  // one tick
      var grant = lab.getGrant();
      achievements.update('count', 'money', grant);
      UI.showUpdateValue("#update-funding", grant);
      var sum = 0;
      for (var i = 0; i < workers.length; i++) {
        sum += workers[i].hired * workers[i].rate;
      }
      lab.acquire(sum);
      achievements.update('count', 'data', sum);
      UI.showUpdateValue("#update-data", sum);
      detector.addEventExternal();
    }, 1000);
  }]);

  app.controller('ResearchController', function() {
    this.research = research;
    this.doResearch = function(item) {
      var cost = item.research();
      if (cost > 0) {
        achievements.update('count', 'reputation', item.reputation);
        achievements.update('count', 'dataSpent', cost);
        achievements.update('research', item.name, 1);
        UI.showUpdateValue("#update-data", -cost);
        UI.showUpdateValue("#update-reputation", item.reputation);
      }
    };
  });

  app.controller('HRController', function() {
    this.workers = workers;
    this.hire = function(worker) {
      var cost = worker.hire();
      if (cost > 0) {
        achievements.update('count', 'moneyWorkers', cost);
        achievements.update('workers', worker.name, 1);
        achievements.update('count', 'workers', 1);
        UI.showUpdateValue("#update-funding", -cost);
      }
    };
  });

  app.controller('UpgradesController', function() {
    this.upgrades = upgrades;
    this.upgrade = function(upgrade) {
      if (upgrade.buy()) {
        achievements.update('count', 'moneyUpgrades', upgrade.cost);
      }
    }
  });

  achievements.setList(Helpers.loadFile('json/achievements.json'));
  achievements.restore();

  app.controller('AchievementsController', function() {
    this.achievements = achievements.listSummary;
    this.achievementsAll = achievements.list;
  });

  app.controller('SaveController', ['$scope', '$interval', function($scope, $interval) {
    $scope.lastSaved = new Date();
    $scope.saveNow = function() {
      GameObjects.saveAll();
      $scope.lastSaved = new Date();
      achievements.lastSave = $scope.lastSaved.getTime();
    };
    $scope.restart = function() {
      if (window.confirm('Valóban újra szeretnéd indítani a játékot? Minden eddigi haladásod el fog veszni.')){
        ObjectStorage.clear();
        window.location.reload(true);
      }
    };
    $interval($scope.saveNow, 10000);
  }]);
})();
