using System;
using System.Collections.Generic;

namespace Shapes
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Shape> shapes = new List<Shape>();

            shapes.Add(new Square("Red", 4));
            shapes.Add(new Rectangle("Blue", 5, 3));
            shapes.Add(new Circle("Green", 2.5));

            foreach (Shape shape in shapes)
            {
                string color = shape.GetColor();
                double area = shape.GetArea();

                Console.WriteLine($"The {color} shape has an area of {area:F2}.");
            }
        }
    }
}
