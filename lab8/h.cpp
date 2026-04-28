#include <iostream>
#include <vector>
#include <iomanip>
#include <cmath>
using namespace std;
struct Point{double x;double y;};
int main(){
    cout << fixed << setprecision(4);
    vector<Point> points ={{0.00, -3.50},{2.82, 3.92},{5.56, 7.88},{8.08, 9.50},{10.41, 6.41},{12.20, 4.13};
    int n = points.size();
    vector<double> h(n + 1);
    vector<double> u(n + 1), w(n + 1), v(n + 1), F(n + 1);
    vector<double> A(n + 1), B(n + 1), c(n + 1);
    vector<double> a(n + 1), b(n + 1), d(n + 1);
    // 1. Обчислюємо кроки h
    for (int i = 1; i < n; i++){h[i] = points[i].x - points[i - 1].x; }
    cout << "Таблиця h:" << endl;
    cout << setw(5) << "i" << setw(12) << "h[i]" << endl;
    for (int i = 1; i < n; i++){   cout << setw(5) << i << setw(12) << h[i] << endl; }
    cout << endl;
    // 2. Обчислюємо коефіцієнти трьохдіагональної системи
    for (int i = 2; i <= n - 1; i++) {
        u[i] = h[i];
        w[i] = h[i - 1];
        v[i] = -2 * (h[i - 1] + h[i]);
        F[i] = 3 * ((points[i].y - points[i - 1].y) / h[i]- (points[i - 1].y - points[i - 2].y) / h[i - 1]);}
    cout << "Таблиця коефіцієнтів системи:" << endl;
    cout << setw(5) << "i"
        << setw(12) << "w[i]"
        << setw(12) << "v[i]"
        << setw(12) << "u[i]"
        << setw(12) << "F[i]" << endl;
    for (int i = 2; i <= n - 1; i++){
        cout << setw(5) << i
            << setw(12) << w[i]
            << setw(12) << v[i]
            << setw(12) << u[i]
            << setw(12) << F[i] << endl;
    }
    cout << endl;
    // 3. Виводимо трьохдіагональну систему
    cout << "Трьохдіагональна система лінійних рівнянь відносно невідомих має вигляд:" << endl;
    cout << "c1 = 0, c6 = 0" << endl << endl;
    for (int i = 2; i <= n - 1; i++){
        cout << w[i] << " * c" << i - 1
            << " - " << abs(v[i]) << " * c" << i
            << " + " << u[i] << " * c" << i + 1
            << " = " << F[i] << endl;
    }
    cout << endl;
    // 4. Метод прогонки
    cout << "Застосовуємо метод прогонки:" << endl;
    for (int i = 2; i <= n - 1; i++){
        if (i == 2) {
            A[i] = u[i] / v[i];
            B[i] = -F[i] / v[i];
        }
        else{
            double denominator = v[i] - w[i] * A[i - 1];
            A[i] = u[i] / denominator;
            B[i] = (w[i] * B[i - 1] - F[i]) / denominator;
        }
    }

    cout << endl << "Коефіцієнти A:" << endl;
    for (int i = 2; i <= n - 1; i++){
        cout << "A" << i << " = " << A[i] << endl;
    }
    cout << endl << "Коефіцієнти B:" << endl;
    for (int i = 2; i <= n - 1; i++){cout << "B" << i << " = " << B[i] << endl }
    cout << endl;
    // 5. Знаходимо коефіцієнти c
    c[1] = 0;
    c[n] = 0;
    for (int i = n - 1; i >= 2; i--){c[i] = A[i] * c[i + 1] + B[i];}
    cout << "Знаходимо невідомі коефіцієнти c:" << endl;
    for (int i = 1; i <= n; i++){cout << "c" << i << " = " << c[i] << endl;}
    cout << endl;
    // 6. Знаходимо коефіцієнти a, b, d
    for (int i = 1; i < n; i++) {
        a[i] = points[i - 1].y;
        b[i] = (points[i].y - points[i - 1].y) / h[i] - h[i] * (2 * c[i] + c[i + 1]) / 3;
        d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
    }
    cout << "Коефіцієнти a:" << endl;
    for (int i = 1; i < n; i++){cout << "a" << i << " = " << a[i] << endl;}
    cout << endl;
    cout << "Коефіцієнти b:" << endl;
    for (int i = 1; i < n; i++){cout << "b" << i << " = " << b[i] << endl;}
    cout << endl;
    cout << "Коефіцієнти d:" << endl;
    for (int i = 1; i < n; i++){cout << "d" << i << " = " << d[i] << endl;}
    cout << endl;
    // 7. Виводимо готові сплайни
    cout << "Результат інтерполяції:" << endl << endl;
    for (int i = 1; i < n; i++){
        cout << "F" << i << "(x) = "
            << a[i]
            << " + " << b[i] << " * (x - " << points[i - 1].x << ")"
            << " + " << c[i] << " * (x - " << points[i - 1].x << ")^2"
            << " + " << d[i] << " * (x - " << points[i - 1].x << ")^3"
            << " для інтервалу ["
            << points[i - 1].x << "; " << points[i].x << "]"
            << endl;
    }
    cout << endl;
    // 8. Перевірка гладкості у точці x3
    cout << "Оцінимо отриманий результат інтерполяції:" << endl;
    int i = 2;
    double derivativeLeft = b[i]
        + 2 * c[i] * (points[i].x - points[i - 1].x)
        + 3 * d[i] * pow(points[i].x - points[i - 1].x, 2);
    cout << "F" << i << "'(x" << i + 1 << ") = "
        << derivativeLeft << endl;
    i = 3;
    double derivativeRight = b[i] + 2 * c[i] * (points[i - 1].x - points[i - 1].x) + 3 * d[i] * pow(points[i - 1].x - points[i - 1].x, 2);
    cout << "F" << i << "'(x" << i << ") = "<< derivativeRight << endl;
    i = 2;
    double secondDerivativeLeft = 2 * c[i]+ 6 * d[i] * (points[i].x - points[i - 1].x);
    cout << "F" << i << "''(x" << i + 1 << ") = "<< secondDerivativeLeft << endl;
    i = 3;
    double secondDerivativeRight = 2 * c[i]+ 6 * d[i] * (points[i - 1].x - points[i - 1].x);
    cout << "F" << i << "''(x" << i << ") = "<< secondDerivativeRight << endl;
    cout << endl;
    // 9. Точки для побудови графіка
    cout << "Вивід точок для графіку F(x):" << endl;
    cout << "(x, F(x))" << endl;

    for (int interval = 1; interval < n; interval++)
    {
        double left = points[interval - 1].x;
        double right = points[interval].x;
        double step = (right - left) / 4.0;

        for (int j = 0; j < 4; j++)
        {
            double x = left + j * step;
            double value = a[interval]
                + b[interval] * (x - left)
                + c[interval] * pow(x - left, 2)
                + d[interval] * pow(x - left, 3);

            cout << "(" << x << ", " << value << ")" << endl;
        }
    }

    double x = points[n - 1].x;
    int interval = n - 1;

    double value = a[interval]
        + b[interval] * (x - points[interval - 1].x)
        + c[interval] * pow(x - points[interval - 1].x, 2)
        + d[interval] * pow(x - points[interval - 1].x, 3);

    cout << "(" << x << ", " << value << ")" << endl;
}

#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;
double fi(double x){return pow(4 * x + 1, 0.25);}
int main(){
    double xk = 1.8;
    double xk1;
    int k = 0;
    cout << "k   xk       fi(xk)    |xk+1-xk|" << endl;
    while (true){
        xk1 = fi(xk);
  cout << k << "   "
             << fixed << setprecision(4)
             << xk << "   "
             << xk1 << "   "
             << fabs(xk1 - xk)
             << endl;
        if (fabs(xk1 - xk) <= 0.001){
            cout << "\nx* = " << xk1 << endl;
            break;
        }
        xk = xk1;
        k++;
    }
}

#include <iostream>
#include <iomanip>
#include <cmath>
using namespace std;
double f(double x){return x * x * x * x - 4 * x - 1;}
double xK_plus_one(double x, double xLast){ return (f(x) * xLast - f(xLast) * x) / (f(x) - f(xLast));}
int main(){
    double xk = 1.8;
    double xkMinusOne = 1.3;
    double xKPlusOne = 0;
    int k = 0;
    cout << fixed << setprecision(4);
    while (true){
        xKPlusOne = xK_plus_one(xk, xkMinusOne);
        cout << "k = " << k
             << "; x(k-1) = " << xkMinusOne
             << "; xk = " << xk
             << "; f(xk) = " << f(xk)
             << "; x(k+1) = " << xKPlusOne
             << "; |x(k+1)-xk| = " << fabs(xKPlusOne - xk)
             << endl;
        if (fabs(xKPlusOne - xk) <= 0.001){
            cout << "x* = " << xKPlusOne << endl;
            break;
        }
        xkMinusOne = xk;
        xk = xKPlusOne;
        k++;
    }
}



#include <iostream>
#include <cmath>
#include <iomanip>
using namespace std;
double f(double x){return pow(x, 4) - 4 * x - 1;}
double der_f(double x){return 4 * pow(x, 3) - 4;}
double xk_plus_one(double x){ return x - f(x) / der_f(x);}
int main(){
    double xk = 1.8;
    double xKPlusOne = 0;
    int k = 0;
    cout << fixed << setprecision(4);
    while (true){
        xKPlusOne = xk_plus_one(xk);
        cout << "k = " << k
             << "; xk = " << xk
             << "; f(xk) = " << f(xk)
             << "; f'(xk) = " << der_f(xk)
             << "; f(xk)/f'(xk) = " << f(xk) / der_f(xk)
             << "; |xk+1-xk| = " << fabs(xKPlusOne - xk)
             << endl;
        if (fabs(xKPlusOne - xk) <= 0.001){
            cout << "k = " << k + 1 << " ; x* = " << xKPlusOne << endl;
            break;
        }
        xk = xKPlusOne;
        k++;
    }
}

#include <iostream>
#include <cmath>
using namespace std;
double f(double x){return x * x * x * x - 4 * x - 1;}
int main(){
    double a = 1.3;
    double b = 1.8;
    double c;
    while ((b - a) >= 0.002){
        c = (a + b) / 2;
        cout << "a = " << a
             << "   b = " << b
             << "   c = " << c
             << "   f(c) = " << f(c) << endl;
        if (f(a) * f(c) < 0)
            b = c;
        else
            a = c;
    }
    cout << "x = " << (a + b) / 2 << endl;
}