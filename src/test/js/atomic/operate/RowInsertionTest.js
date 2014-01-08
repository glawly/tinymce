test(
  'InsertionTest',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.scullion.Struct',
    'ephox.snooker.api.Structs',
    'ephox.snooker.model.Warehouse',
    'ephox.snooker.operate.RowInsertion'
  ],

  function (Arr, Fun, Struct, Structs, Warehouse, RowInsertion) {
    var check = function (expected, method, input, rowIndex, colIndex) {
      var warehouse = Warehouse.generate(input);
      var actual = method(warehouse, rowIndex, colIndex, {
        row: function () {
          return {
            element: Fun.constant('???')
          };
        },
        cell: function (aa) {
          return d('?' + aa.element(), 1, 1);
        }
      }, function (a, b) {
        return a === b;
      });

      assert.eq(expected.length, actual.length);
      Arr.each(expected, function (exp, i) {
        var act = actual[i];
        var raw = Arr.map(act.cells(), function (cell) {
          return {
            element: cell.element(),
            colspan: cell.colspan(),
            rowspan: cell.rowspan()
          };
        });

        assert.eq(exp, raw);
      });
    };

    var r = Structs.rowdata;
    var d = Structs.detail;

    var generate = function () {
      return [
        r('r0', [ d('a', 1, 1), d('c', 2, 1) ]),
        r('r1', [ d('b', 1, 1) ])
      ];
    };

    var complex = function () {
      return [
        r('r0', [ d('a', 2, 1), d('b', 1, 1), d('c', 1, 1) ]),
        r('r1', [ d('d', 1, 2) ]),
        r('r2', [ d('e', 1, 1), d('f', 1, 2) ])
      ];
    };

    check([
      [ { element: 'a', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 3 }],
      [ { element: '?a', colspan: 1, rowspan: 1 } ],
      [ { element: 'b', colspan: 1, rowspan: 1 } ]
    ], RowInsertion.insertAfter, generate(), 0, 0);

    check([
      [ { element: 'a', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 2 } ],
      [ { element: 'b', colspan: 1, rowspan: 1 } ],
      [ { element: '?b', colspan: 1, rowspan: 1 }, { element: '?c', colspan: 1, rowspan: 1 }]
    ], RowInsertion.insertAfter, generate(), 1, 0);

    check([
      [ { element: 'a', colspan: 1, rowspan: 2 }, { element: 'b', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 1 } ],
      [ { element: 'd', colspan: 2, rowspan: 1 } ],
      [ { element: '?a', colspan: 1, rowspan: 1 }, { element: '?d', colspan: 1, rowspan: 1 }, { element: '?d', colspan: 1, rowspan: 1 } ],
      [ { element: 'e', colspan: 1, rowspan: 1 }, { element: 'f', colspan: 2, rowspan: 1 } ]
    ], RowInsertion.insertAfter, complex(), 1, 0);


    check([
      [ { element: 'a', colspan: 1, rowspan: 3 }, { element: 'b', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 1 } ],
      [ { element: '?b', colspan: 1, rowspan: 1 }, { element: '?c', colspan: 1, rowspan: 1 } ],
      [ { element: 'd', colspan: 2, rowspan: 1 } ],
      [ { element: 'e', colspan: 1, rowspan: 1 }, { element: 'f', colspan: 2, rowspan: 1 } ]
    ], RowInsertion.insertAfter, complex(), 0, 2);

    check([
      [ { element: '?a', colspan: 1, rowspan: 1 }, { element: '?c', colspan: 1, rowspan: 1 } ],
      [ { element: 'a', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 2 } ],
      [ { element: 'b', colspan: 1, rowspan: 1 } ]
    ], RowInsertion.insertBefore, generate(), 0, 0);

    check([
      [ { element: '?a', colspan: 1, rowspan: 1 }, { element: '?c', colspan: 1, rowspan: 1 } ],
      [ { element: 'a', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 2 } ],
      [ { element: 'b', colspan: 1, rowspan: 1 } ]
    ], RowInsertion.insertBefore, generate(), 0, 1);

    check([
      [ { element: 'b', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 1 } ]
    ], RowInsertion.erase, generate(), 0, 0);

    check([
      [ { element: 'b', colspan: 1, rowspan: 1 }, { element: 'c', colspan: 1, rowspan: 1 }, { element: 'f', colspan: 2, rowspan: 1 } ]
    ], RowInsertion.erase, [
      r('r0', [ d('a', 1, 1), d('c', 2, 1), d('e', 1, 2) ]),
      r('r1', [ d('b', 1, 1), d('f', 1, 2) ])
    ], 0, 0);
// var generate = function () {
//       return [
//         r('r0', [ d('a', 1, 1), d('c', 2, 1) ]),
//         r('r1', [ d('b', 1, 1) ])
//       ];
//     };
  }
);
