using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthMindBackend.Domain.ValueObjects.Base
{
    public abstract class ValueObject
    {
        protected abstract IEnumerable<Object> GetEqualityComponents();

        public override Boolean Equals(Object? obj)
        {
            if (obj == null || obj.GetType() != GetType())
                return false;

            var other = (ValueObject)obj;

            return GetEqualityComponents()
                .SequenceEqual(other.GetEqualityComponents());
        }

        public override Int32 GetHashCode()
        {
            return GetEqualityComponents()
                 .Aggregate(1, (current, obj) =>
                 {
                     return HashCode.Combine(current, obj);
                 });
        }

        public static Boolean operator ==(ValueObject a, ValueObject b)
        {
            if(a is null && b is null)
                return true;

            if(a is null || b is null)
                return false;

            return a.Equals(b);
        }
        
        public static Boolean operator !=(ValueObject a, ValueObject b)
        {
            return !(a == b);
        }
    }
}
