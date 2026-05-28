#include <iostream>
#include <vector>
#include <iomanip>
#include <cmath>

using namespace std;

struct Point
{
    double x;
    double y;
};

int main()
{
    cout << fixed << setprecision(4);

    vector<Point> points =
    {
        {6.22, -12.02},
        {10.35, -7.05},
        {15.75, -2.74},
        {18.98,  1.67},
        {20.04,  7.81},
        {29.11, 19.62}
    };

    int n = points.size(); // кількість точок

    // Масиви
    vector<double> h(n);          // h[1]..h[n-1]
    vector<double> w(n), v(n), u(n), rhs(n); // коефіцієнти системи
    vector<double> alpha(n), beta(n), c(n), a(n), b(n), d(n);

    // 1. Обчислення кроків h
    for (int i = 1; i < n; i++)
    {
        h[i] = points[i].x - points[i - 1].x;
    }

    cout << "Таблиця h:\n";
    cout << setw(5) << "i" << setw(12) << "h[i]" << "\n";
    for (int i = 1; i < n; i++)
    {
        cout << setw(5) << i << setw(12) << h[i] << "\n";
    }
    cout << "\n";

    // 2. Обчислення коефіцієнтів тридіагональної системи
    // Система:
    // w[i] * c[i-1] + v[i] * c[i] + u[i] * c[i+1] = rhs[i]
    // для i = 1..n-2 у 0-based нумерації внутрішніх вузлів
    // Але тут залишимо i = 1..n-2 по масиву c[0]..c[n-1]

    for (int i = 1; i <= n - 2; i++)
    {
        w[i] = h[i];
        v[i] = 2.0 * (h[i] + h[i + 1]);
        u[i] = h[i + 1];
        rhs[i] = 3.0 * (
            (points[i + 1].y - points[i].y) / h[i + 1]
            - (points[i].y - points[i - 1].y) / h[i]
        );
    }

    cout << "Таблиця коефіцієнтів системи:\n";
    cout << setw(5) << "i"
         << setw(12) << "w[i]"
         << setw(12) << "v[i]"
         << setw(12) << "u[i]"
         << setw(12) << "F[i]" << "\n";

    for (int i = 1; i <= n - 2; i++)
    {
        cout << setw(5) << i + 1
             << setw(12) << w[i]
             << setw(12) << v[i]
             << setw(12) << u[i]
             << setw(12) << rhs[i] << "\n";
    }
    cout << "\n";

    // 3. Виведення системи
    cout << "Трьохдіагональна система лінійних рівнянь відносно невідомих c_i:\n";
    cout << "c1 = 0, c" << n << " = 0\n\n";

    for (int i = 1; i <= n - 2; i++)
    {
        cout << w[i] << " * c" << i
             << " + " << v[i] << " * c" << i + 1
             << " + " << u[i] << " * c" << i + 2
             << " = " << rhs[i] << "\n";
    }
    cout << "\n";

    // 4. Метод прогонки для внутрішніх c[1]..c[n-2]
    // Граничні умови натурального сплайна:
    c[0] = 0.0;
    c[n - 1] = 0.0;

    // Прямий хід
    alpha[1] = -u[1] / v[1];
    beta[1] = rhs[1] / v[1];

    for (int i = 2; i <= n - 2; i++)
    {
        double denominator = v[i] + w[i] * alpha[i - 1];
        alpha[i] = -u[i] / denominator;
        beta[i] = (rhs[i] - w[i] * beta[i - 1]) / denominator;
    }

    cout << "Коефіцієнти alpha:\n";
    for (int i = 1; i <= n - 2; i++)
    {
        cout << "alpha" << i + 1 << " = " << alpha[i] << "\n";
    }
    cout << "\n";

    cout << "Коефіцієнти beta:\n";
    for (int i = 1; i <= n - 2; i++)
    {
        cout << "beta" << i + 1 << " = " << beta[i] << "\n";
    }
    cout << "\n";

    // Зворотний хід
    c[n - 2] = beta[n - 2];
    for (int i = n - 3; i >= 1; i--)
    {
        c[i] = alpha[i] * c[i + 1] + beta[i];
    }

    cout << "Коефіцієнти c:\n";
    for (int i = 0; i < n; i++)
    {
        cout << "c" << i + 1 << " = " << c[i] << "\n";
    }
    cout << "\n";

    // 5. Обчислення коефіцієнтів a, b, d
    // Для кожного інтервалу [x_i, x_{i+1}]
    for (int i = 0; i < n - 1; i++)
    {
        a[i] = points[i].y;
        b[i] = (points[i + 1].y - points[i].y) / h[i + 1]
             - h[i + 1] * (2.0 * c[i] + c[i + 1]) / 3.0;
        d[i] = (c[i + 1] - c[i]) / (3.0 * h[i + 1]);
    }

    cout << "Коефіцієнти a:\n";
    for (int i = 0; i < n - 1; i++)
    {
        cout << "a" << i + 1 << " = " << a[i] << "\n";
    }
    cout << "\n";

    cout << "Коефіцієнти b:\n";
    for (int i = 0; i < n - 1; i++)
    {
        cout << "b" << i + 1 << " = " << b[i] << "\n";
    }
    cout << "\n";

    cout << "Коефіцієнти d:\n";
    for (int i = 0; i < n - 1; i++)
    {
        cout << "d" << i + 1 << " = " << d[i] << "\n";
    }
    cout << "\n";

    // 6. Виведення сплайнів
    cout << "Результат інтерполяції:\n\n";
    for (int i = 0; i < n - 1; i++)
    {
        cout << "S" << i + 1 << "(x) = "
             << a[i]
             << " + " << b[i] << " * (x - " << points[i].x << ")"
             << " + " << c[i] << " * (x - " << points[i].x << ")^2"
             << " + " << d[i] << " * (x - " << points[i].x << ")^3"
             << " ,  x in [" << points[i].x << "; " << points[i + 1].x << "]\n";
    }
    cout << "\n";

    // 7. Перевірка гладкості в одній внутрішній точці
    // Перевіримо в точці x4 = points[3].x
    cout << "Перевірка гладкості у внутрішній точці x4 = " << points[3].x << ":\n";

    int leftInterval = 2;   // S3 на [x3, x4]
    int rightInterval = 3;  // S4 на [x4, x5]

    double dxLeft = points[3].x - points[2].x; // x4 - x3

    double firstLeft = b[leftInterval]
                     + 2.0 * c[leftInterval] * dxLeft
                     + 3.0 * d[leftInterval] * dxLeft * dxLeft;

    double firstRight = b[rightInterval];

    double secondLeft = 2.0 * c[leftInterval]
                      + 6.0 * d[leftInterval] * dxLeft;

    double secondRight = 2.0 * c[rightInterval];

    cout << "S3'(x4)  = " << firstLeft << "\n";
    cout << "S4'(x4)  = " << firstRight << "\n";
    cout << "S3''(x4) = " << secondLeft << "\n";
    cout << "S4''(x4) = " << secondRight << "\n\n";

    // 8. Точки для побудови графіка
    cout << "Точки для побудови графіка S(x):\n";
    cout << "(x, S(x))\n";

    for (int interval = 0; interval < n - 1; interval++)
    {
        double left = points[interval].x;
        double right = points[interval + 1].x;
        double step = (right - left) / 4.0;

        for (int j = 0; j < 4; j++)
        {
            double x = left + j * step;
            double t = x - left;

            double value = a[interval]
                         + b[interval] * t
                         + c[interval] * t * t
                         + d[interval] * t * t * t;

            cout << "(" << x << ", " << value << ")\n";
        }
    }

    // остання точка
    {
        int interval = n - 2;
        double x = points[n - 1].x;
        double t = x - points[interval].x;

        double value = a[interval]
                     + b[interval] * t
                     + c[interval] * t * t
                     + d[interval] * t * t * t;

        cout << "(" << x << ", " << value << ")\n";
    }

    return 0;
}